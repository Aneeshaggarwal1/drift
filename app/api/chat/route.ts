import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getProfile, getRecentTrips, getTrip, getConversation, createConversation, appendMessages, createProfile, updateProfile } from '@/lib/db/queries';
import { anthropic, buildSystemPrompt } from '@/lib/ai/agent';
import { parseAIResponse } from '@/lib/ai/parser';
import { deepMerge } from '@/lib/utils/merge';
import type { ConversationType, ProfileData, Message } from '@/lib/types';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const { conversationType, message, conversationId, tripId } = await request.json() as {
    conversationType: ConversationType;
    message: string;
    conversationId?: string;
    tripId?: string;
  };

  if (!message?.trim()) return NextResponse.json({ error: 'message is required' }, { status: 400 });

  // Load context
  const profile = getProfile(userId);
  const recentTrips = getRecentTrips(userId, 5);
  const tripData = tripId ? getTrip(userId, tripId) : null;

  // Get or create conversation
  let convId = conversationId;
  let history: Message[] = [];

  if (convId) {
    const existing = getConversation(userId, convId);
    if (existing) history = existing.messages;
  } else {
    const conv = createConversation(userId, conversationType, tripId);
    convId = conv.id;
  }

  const systemPrompt = buildSystemPrompt(conversationType, { profile, recentTrips, tripData });

  const messages = [
    ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = '';

      try {
        const anthropicStream = anthropic.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt,
          messages,
        });

        for await (const event of anthropicStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, conversationId: convId })}\n\n`));
        controller.close();

        // Save messages
        appendMessages(userId, convId!, [
          { role: 'user', content: message },
          { role: 'assistant', content: fullResponse },
        ]);

        // Process AI actions (profile extraction, updates)
        await processAIActions(fullResponse, userId, conversationType, profile);

      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

async function processAIActions(
  response: string,
  userId: string,
  conversationType: ConversationType,
  existingProfile: ReturnType<typeof getProfile>,
) {
  const segments = parseAIResponse(response);

  for (const segment of segments) {
    if (segment.type !== 'json_block') continue;
    const data = segment.data as { type?: string; data?: unknown };

    if (data?.type === 'travel_profile' && conversationType === 'onboarding') {
      const profileData = data.data as ProfileData;
      if (!existingProfile) {
        createProfile(userId, profileData, profileData?.traveler_type ?? null, profileData?.traveler_description ?? null);
      } else {
        const merged = deepMerge<ProfileData>(existingProfile.profile_data, profileData);
        updateProfile(userId, merged, profileData?.traveler_type, profileData?.traveler_description);
      }
    }

    if (data?.type === 'profile_update') {
      if (existingProfile) {
        const update = data.data as { field_path?: string; new_value?: unknown };
        if (update?.field_path && update?.new_value !== undefined) {
          const parts = update.field_path.split('.');
          const patch = buildNestedPatch(parts, update.new_value);
          const merged = deepMerge<ProfileData>(existingProfile.profile_data, patch);
          updateProfile(userId, merged);
        }
      }
    }
  }
}

function buildNestedPatch(parts: string[], value: unknown): Record<string, unknown> {
  if (parts.length === 1) return { [parts[0]]: value };
  return { [parts[0]]: buildNestedPatch(parts.slice(1), value) };
}

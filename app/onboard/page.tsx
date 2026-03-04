'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/chat/ChatInterface';
import { saveProfile } from '@/lib/api/client';
import type { ProfileData } from '@/lib/types';

export default function OnboardPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleConfirmProfile(data: ProfileData) {
    setSaving(true);
    try {
      await saveProfile({
        profile_data: data,
        traveler_type: data.traveler_type ?? undefined,
        traveler_description: data.traveler_description ?? undefined,
      });
      router.push('/');
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="h-dvh bg-[#0F0F0F] flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-[#2A2A2A] flex items-center gap-3">
        <span className="text-xl font-bold text-[#E8A838]" style={{ fontFamily: 'Fraunces, serif' }}>
          Drift
        </span>
        <span className="text-[#A09A90] text-sm">Let&apos;s get to know you</span>
        {saving && <span className="ml-auto text-[#A09A90] text-xs">Saving your profile…</span>}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          conversationType="onboarding"
          initialMessage="Hey! I'm Drift, your personal travel companion. I'd love to get to know how you travel so I can plan trips that are actually perfect for you. Let's start simple — what's been your favourite trip so far, and what made it so good?"
          placeholder="Tell me about yourself as a traveller…"
          onConfirmProfile={handleConfirmProfile}
          className="h-full"
        />
      </div>
    </div>
  );
}

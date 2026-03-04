'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import ChatInterface from '@/components/chat/ChatInterface';
import { createTrip } from '@/lib/api/client';
import type { Trip, DestinationCard, ItineraryDay } from '@/lib/types';

interface HomeClientProps {
  recentTrips: Trip[];
}

export default function HomeClient({ recentTrips: initialTrips }: HomeClientProps) {
  const router = useRouter();
  const [recentTrips, setRecentTrips] = useState(initialTrips);
  const [chatKey, setChatKey] = useState(0); // reset chat on New Trip
  const [pickedDestination, setPickedDestination] = useState<DestinationCard | null>(null);
  const [convId, setConvId] = useState<string | undefined>();

  function handleNewTrip() {
    setChatKey(k => k + 1);
    setPickedDestination(null);
    setConvId(undefined);
  }

  const handlePickDestination = useCallback((card: DestinationCard) => {
    setPickedDestination(card);
  }, []);

  const handleSaveTrip = useCallback(async (days: ItineraryDay[]) => {
    if (!pickedDestination) return;
    try {
      const trip = await createTrip({
        destination: pickedDestination.name,
        duration_days: days.length,
        start_date: days[0]?.date ?? null,
        end_date: days[days.length - 1]?.date ?? null,
        companions: null,
        status: 'planned',
        itinerary: days,
        destination_options: null,
        budget_estimated: pickedDestination.budget_estimate,
        budget_actual: null,
        rating: null,
        feedback: null,
        profile_updates_applied: null,
      });
      setRecentTrips(prev => [trip, ...prev.slice(0, 4)]);
      router.refresh();
    } catch {
      // error handled gracefully by chat
    }
  }, [pickedDestination, router]);

  return (
    <AppLayout recentTrips={recentTrips} onNewTrip={handleNewTrip}>
      <div className="h-full flex flex-col">
        {/* Page heading — desktop only */}
        <div className="hidden sm:flex items-center gap-3 px-6 py-4 border-b border-[#2A2A2A] shrink-0">
          <h1 className="text-lg font-semibold text-[#F5F0E8]" style={{ fontFamily: 'Fraunces, serif' }}>
            {pickedDestination ? `Planning — ${pickedDestination.name}` : 'Plan a Trip'}
          </h1>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatInterface
            key={chatKey}
            conversationType="trip_planning"
            conversationId={convId}
            placeholder="Where do you want to go? Tell me about your trip…"
            onPickDestination={handlePickDestination}
            onSaveTrip={handleSaveTrip}
            onConversationId={setConvId}
            className="h-full"
          />
        </div>
      </div>
    </AppLayout>
  );
}

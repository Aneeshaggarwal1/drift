'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import Modal from '@/components/ui/Modal';
import ItineraryDayCard from '@/components/chat/ItineraryDayCard';
import ChatInterface from '@/components/chat/ChatInterface';
import { updateTrip } from '@/lib/api/client';
import { formatINR } from '@/lib/utils/budget';
import type { Trip } from '@/lib/types';

export default function TripDetailClient({ trip: initialTrip }: { trip: Trip }) {
  const [trip, setTrip] = useState(initialTrip);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [savingRating, setSavingRating] = useState(false);

  async function handleRating(rating: number) {
    setSavingRating(true);
    try {
      const updated = await updateTrip(trip.id, { rating });
      setTrip(updated);
    } finally {
      setSavingRating(false);
    }
  }

  async function handleMarkCompleted() {
    const updated = await updateTrip(trip.id, { status: 'completed' });
    setTrip(updated);
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back */}
        <Link href="/trips" className="inline-flex items-center gap-1.5 text-[#A09A90] text-sm hover:text-[#F5F0E8] transition-colors mb-5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All trips
        </Link>

        <PageHeader
          title={trip.destination}
          subtitle={[trip.start_date, trip.end_date].filter(Boolean).join(' → ') || undefined}
          actions={
            <div className="flex items-center gap-2">
              <Badge variant={trip.status}>{trip.status}</Badge>
              {trip.status === 'planned' && (
                <Button variant="secondary" size="sm" onClick={handleMarkCompleted}>
                  Mark completed
                </Button>
              )}
            </div>
          }
        />

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-[#A09A90] mb-6">
          {trip.duration_days && <span>{trip.duration_days} days</span>}
          {trip.companions && <span>With {trip.companions}</span>}
        </div>

        {/* Budget */}
        {trip.budget_estimated && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 mb-6">
            <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-3">Estimated Budget</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Flights', val: trip.budget_estimated.flights_inr },
                { label: 'Stay/night', val: trip.budget_estimated.stay_per_night_inr },
                { label: 'Daily', val: trip.budget_estimated.daily_expenses_inr },
                { label: 'Total', val: trip.budget_estimated.total_estimate_inr },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-[#A09A90] text-xs mb-0.5">{label}</p>
                  <p className="text-[#E8A838] font-mono text-sm font-semibold">{formatINR(val)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary */}
        {trip.itinerary && trip.itinerary.length > 0 && (
          <div className="mb-6">
            <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-3">Itinerary</p>
            <div className="space-y-2">
              {trip.itinerary.map((day, i) => (
                <ItineraryDayCard key={i} day={day} />
              ))}
            </div>
          </div>
        )}

        {/* Completed: rating + review */}
        {trip.status === 'completed' && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-2">Your rating</p>
              <StarRating
                value={trip.rating ?? 0}
                onChange={handleRating}
                readOnly={savingRating}
                size="lg"
              />
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setReviewOpen(true)}
            >
              How was it? ✦ Leave a review
            </Button>
          </div>
        )}
      </div>

      {/* Review modal */}
      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title={`Review — ${trip.destination}`}
        className="sm:max-w-2xl"
      >
        <div className="h-96">
          <ChatInterface
            conversationType="trip_review"
            tripId={trip.id}
            placeholder="How did it go?"
            className="h-full"
          />
        </div>
      </Modal>
    </AppLayout>
  );
}

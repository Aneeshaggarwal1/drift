'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import type { Trip } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

const FILTERS = ['all', 'planned', 'ongoing', 'completed'] as const;

export default function TripsClient({ trips }: { trips: Trip[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');

  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PageHeader title="Trips" subtitle={`${trips.length} trip${trips.length !== 1 ? 's' : ''} saved`} />

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-1 w-fit">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                filter === f
                  ? 'bg-[#E8A838] text-[#0F0F0F]'
                  : 'text-[#A09A90] hover:text-[#F5F0E8]',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">✈️</p>
            <p className="text-[#F5F0E8] font-semibold mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
              No trips yet
            </p>
            <p className="text-[#A09A90] text-sm mb-5">Head to the home page to plan your first adventure.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#E8A838] text-[#0F0F0F] rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#d4972e] transition-colors"
            >
              Plan a trip
            </Link>
          </div>
        )}

        {/* Trip cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map(trip => (
            <Link key={trip.id} href={`/trips/${trip.id}`}>
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 hover:bg-[#252525] hover:border-[#3A3A3A] transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-[#F5F0E8] font-semibold" style={{ fontFamily: 'Fraunces, serif' }}>
                    {trip.destination}
                  </h3>
                  <Badge variant={trip.status}>{trip.status}</Badge>
                </div>

                <div className="space-y-1 text-sm text-[#A09A90]">
                  {(trip.start_date || trip.end_date) && (
                    <p>{trip.start_date ?? ''}{trip.end_date ? ` → ${trip.end_date}` : ''}</p>
                  )}
                  {trip.duration_days && <p>{trip.duration_days} day{trip.duration_days !== 1 ? 's' : ''}</p>}
                  {trip.companions && <p>With {trip.companions}</p>}
                </div>

                {trip.status === 'completed' && trip.rating && (
                  <div className="mt-3">
                    <StarRating value={trip.rating} readOnly size="sm" />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

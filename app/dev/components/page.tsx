'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import StarRating from '@/components/ui/StarRating';
import LoadingDots from '@/components/ui/LoadingDots';
import Skeleton from '@/components/ui/Skeleton';
import TypingIndicator from '@/components/chat/TypingIndicator';
import DestinationCard from '@/components/chat/DestinationCard';
import ItineraryDayCard from '@/components/chat/ItineraryDayCard';
import type { DestinationCard as DestinationCardType, ItineraryDay } from '@/lib/types';

const sampleDestination: DestinationCardType = {
  name: 'Hampi',
  hook: 'Ancient ruins meet boulder-strewn landscapes — nothing in your history comes close.',
  why_it_fits: ['You loved cultural exploration in Pondicherry', 'Great for photography', 'Well within your ₹5k/day comfort zone'],
  weather: '32°C, dry and sunny',
  budget_estimate: { flights_inr: 6000, stay_per_night_inr: 2500, daily_expenses_inr: 3000, total_estimate_inr: 18500 },
  flags: ['Gets very hot after 2pm — plan shaded activities for afternoon'],
  duration_fit: 'Perfect for 3-4 days',
};

const sampleDay: ItineraryDay = {
  day: 1,
  date: 'March 20, 2026',
  morning: {
    activities: [
      { name: 'Virupaksha Temple', place: 'Hampi Bazaar', description: 'Oldest active temple in Hampi, stunning gopuram', duration_minutes: 90, travel_time_from_previous_minutes: 0 },
    ],
  },
  afternoon: {
    activities: [
      { name: 'Vittala Temple', place: 'North of Hampi', description: 'Famous stone chariot and musical pillars', duration_minutes: 120, travel_time_from_previous_minutes: 20 },
    ],
  },
  evening: {
    activities: [
      { name: 'Sunset at Hemakuta Hill', place: 'Hemakuta Hill', description: 'Best sunset views in Hampi with ruined temples', duration_minutes: 60, travel_time_from_previous_minutes: 15 },
    ],
  },
  meals: [
    { type: 'breakfast', restaurant: 'Mango Tree Restaurant', what_to_order: 'Masala dosa and filter coffee', estimated_cost_inr: 200 },
    { type: 'lunch', restaurant: 'Laughing Buddha', what_to_order: 'Thali and fresh lime soda', estimated_cost_inr: 350 },
    { type: 'dinner', restaurant: 'Gopi Rooftop', what_to_order: 'Paneer butter masala with garlic naan', estimated_cost_inr: 500 },
  ],
  daily_cost_estimate_inr: 3800,
  pro_tips: ['Book Vittala Temple tickets online to skip the queue', 'Carry cash — most places don\'t accept cards', 'Rent a bicycle for ₹100/day to get around'],
};

export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(3);
  const [inputVal, setInputVal] = useState('');

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-8 space-y-12 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-[#E8A838] mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
          Drift — Component Showcase
        </h1>
        <p className="text-[#A09A90] text-sm">All UI primitives and chat components</p>
      </div>

      {/* Typography */}
      <section>
        <h2 className="text-xs text-[#A09A90] uppercase tracking-wider mb-4">Typography</h2>
        <div className="space-y-2">
          <p className="text-3xl text-[#F5F0E8]" style={{ fontFamily: 'Fraunces, serif' }}>Fraunces — The Curious Wanderer</p>
          <p className="text-base text-[#F5F0E8]">Plus Jakarta Sans — Your go-to travel companion</p>
          <p className="text-base text-[#E8A838] font-mono">JetBrains Mono — ₹18,500</p>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-xs text-[#A09A90] uppercase tracking-wider mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" loading>Loading</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-xs text-[#A09A90] uppercase tracking-wider mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="amber">Amber</Badge>
          <Badge variant="sage">Sage</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="planned">Planned</Badge>
          <Badge variant="ongoing">Ongoing</Badge>
          <Badge variant="completed">Completed</Badge>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="text-xs text-[#A09A90] uppercase tracking-wider mb-4">Inputs</h2>
        <div className="space-y-4">
          <Input label="Email" placeholder="you@example.com" value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <Input label="With error" placeholder="Enter value" error="This field is required" />
          <TextArea label="Message" placeholder="Tell me about your dream trip…" autoResize />
        </div>
      </section>

      {/* Card */}
      <section>
        <h2 className="text-xs text-[#A09A90] uppercase tracking-wider mb-4">Cards</h2>
        <div className="space-y-3">
          <Card><p className="text-[#F5F0E8] text-sm">Default card</p></Card>
          <Card hover><p className="text-[#F5F0E8] text-sm">Hoverable card — click me</p></Card>
        </div>
      </section>

      {/* StarRating */}
      <section>
        <h2 className="text-xs text-[#A09A90] uppercase tracking-wider mb-4">Star Rating</h2>
        <div className="space-y-3">
          <div>
            <p className="text-[#A09A90] text-xs mb-2">Interactive (current: {rating})</p>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <p className="text-[#A09A90] text-xs mb-2">Read-only</p>
            <StarRating value={4} readOnly />
          </div>
        </div>
      </section>

      {/* Loading */}
      <section>
        <h2 className="text-xs text-[#A09A90] uppercase tracking-wider mb-4">Loading States</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-[#A09A90] text-sm">LoadingDots:</p>
            <LoadingDots />
          </div>
          <div>
            <p className="text-[#A09A90] text-xs mb-2">Skeletons</p>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          <div>
            <p className="text-[#A09A90] text-xs mb-2">TypingIndicator</p>
            <TypingIndicator />
          </div>
        </div>
      </section>

      {/* Modal */}
      <section>
        <h2 className="text-xs text-[#A09A90] uppercase tracking-wider mb-4">Modal</h2>
        <Button variant="secondary" onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Review your trip">
          <p className="text-[#A09A90] text-sm">Modal content goes here. Press Escape or click outside to close.</p>
          <div className="mt-4 flex gap-3">
            <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </Modal>
      </section>

      {/* Chat cards */}
      <section>
        <h2 className="text-xs text-[#A09A90] uppercase tracking-wider mb-4">Destination Card</h2>
        <DestinationCard card={sampleDestination} onPick={c => alert(`Picked: ${c.name}`)} />
      </section>

      <section>
        <h2 className="text-xs text-[#A09A90] uppercase tracking-wider mb-4">Itinerary Day Card</h2>
        <ItineraryDayCard day={sampleDay} />
      </section>
    </div>
  );
}

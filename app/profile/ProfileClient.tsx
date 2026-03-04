'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ChatInterface from '@/components/chat/ChatInterface';
import { formatINR } from '@/lib/utils/budget';
import type { TravelerProfile } from '@/lib/types';

export default function ProfileClient({ profile: initialProfile }: { profile: TravelerProfile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [editOpen, setEditOpen] = useState(false);
  const p = profile.profile_data;

  async function refreshProfile() {
    const res = await fetch('/api/profile');
    if (res.ok) {
      const updated = await res.json();
      if (updated) setProfile(updated);
    }
    setEditOpen(false);
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <PageHeader
          title={profile.traveler_type ?? 'Your Travel Profile'}
          subtitle={profile.traveler_description ?? undefined}
          actions={
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              Edit with AI
            </Button>
          }
        />

        <div className="space-y-4">

          {/* Destinations */}
          {(p.destinations?.visited?.length > 0 || p.destinations?.wishlist?.length > 0) && (
            <Card>
              <SectionTitle>Destinations</SectionTitle>
              {p.destinations?.visited?.length > 0 && (
                <div className="mb-3">
                  <p className="text-[#A09A90] text-xs mb-2">Visited</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.destinations.visited.map((v, i) => (
                      <Badge key={i} variant={v.would_revisit ? 'sage' : 'default'}>
                        {v.place} {v.rating ? `★${v.rating}` : ''}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {p.destinations?.wishlist?.length > 0 && (
                <div>
                  <p className="text-[#A09A90] text-xs mb-2">Wishlist</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.destinations.wishlist.map((d, i) => (
                      <Badge key={i} variant="amber">{d}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Activities */}
          {p.activities && (
            <Card>
              <SectionTitle>Activities</SectionTitle>
              <div className="space-y-3">
                {p.activities.loves?.length > 0 && (
                  <TagRow label="Loves" tags={p.activities.loves} variant="sage" />
                )}
                {p.activities.likes?.length > 0 && (
                  <TagRow label="Likes" tags={p.activities.likes} />
                )}
                {p.activities.dislikes?.length > 0 && (
                  <TagRow label="Dislikes" tags={p.activities.dislikes} variant="error" />
                )}
                {p.activities.pace && (
                  <Info label="Pace" value={p.activities.pace} />
                )}
                {p.activities.morning_person !== null && p.activities.morning_person !== undefined && (
                  <Info label="Morning person" value={p.activities.morning_person ? 'Yes' : 'No — nothing before 10am'} />
                )}
              </div>
            </Card>
          )}

          {/* Food */}
          {p.food && (
            <Card>
              <SectionTitle>Food & Dining</SectionTitle>
              <div className="space-y-3">
                {p.food.food_priority && <Info label="Priority" value={p.food.food_priority} />}
                {p.food.adventurous_eater !== null && p.food.adventurous_eater !== undefined && (
                  <Info label="Adventurous eater" value={p.food.adventurous_eater ? 'Yes' : 'Prefers familiar cuisines'} />
                )}
                {p.food.cuisine_favorites?.length > 0 && (
                  <TagRow label="Favourites" tags={p.food.cuisine_favorites} variant="amber" />
                )}
                {p.food.dietary_restrictions && (
                  <Info label="Dietary" value={p.food.dietary_restrictions} />
                )}
              </div>
            </Card>
          )}

          {/* Accommodation */}
          {p.accommodation && (
            <Card>
              <SectionTitle>Accommodation</SectionTitle>
              <div className="space-y-3">
                {p.accommodation.preferred_types?.length > 0 && (
                  <TagRow label="Prefers" tags={p.accommodation.preferred_types} />
                )}
                {p.accommodation.must_haves?.length > 0 && (
                  <TagRow label="Must-haves" tags={p.accommodation.must_haves} variant="sage" />
                )}
                {(p.accommodation.budget_per_night_inr?.comfortable || p.accommodation.budget_per_night_inr?.splurge) && (
                  <Info
                    label="Budget/night"
                    value={`${formatINR(p.accommodation.budget_per_night_inr.comfortable)} comfortable · ${formatINR(p.accommodation.budget_per_night_inr.splurge)} splurge`}
                  />
                )}
              </div>
            </Card>
          )}

          {/* Budget */}
          {p.budget && (
            <Card>
              <SectionTitle>Budget</SectionTitle>
              <div className="space-y-3">
                {(p.budget.daily_budget_inr?.comfortable || p.budget.daily_budget_inr?.splurge) && (
                  <Info
                    label="Daily budget"
                    value={`${formatINR(p.budget.daily_budget_inr.comfortable)} comfortable · ${formatINR(p.budget.daily_budget_inr.splurge)} splurge`}
                  />
                )}
                {p.budget.splurge_categories?.length > 0 && (
                  <TagRow label="Splurge on" tags={p.budget.splurge_categories} variant="amber" />
                )}
                {p.budget.save_categories?.length > 0 && (
                  <TagRow label="Save on" tags={p.budget.save_categories} />
                )}
                {p.budget.typical_trip_duration_days && (
                  <Info label="Typical trip" value={p.budget.typical_trip_duration_days} />
                )}
              </div>
            </Card>
          )}

          {/* Flights */}
          {p.flights_logistics && (
            <Card>
              <SectionTitle>Flights & Logistics</SectionTitle>
              <div className="space-y-3">
                {p.flights_logistics.seat_preference && (
                  <Info label="Seat" value={p.flights_logistics.seat_preference} />
                )}
                {p.flights_logistics.direct_flights_only !== null && p.flights_logistics.direct_flights_only !== undefined && (
                  <Info label="Direct flights only" value={p.flights_logistics.direct_flights_only ? 'Yes' : 'Stopovers OK'} />
                )}
                {p.flights_logistics.booking_advance && (
                  <Info label="Books" value={p.flights_logistics.booking_advance} />
                )}
                {p.flights_logistics.travel_radius && (
                  <Info label="Travel radius" value={p.flights_logistics.travel_radius} />
                )}
              </div>
            </Card>
          )}

          {/* Deal-breakers */}
          {p.dealbreakers && (p.dealbreakers.weather || p.dealbreakers.other?.length > 0) && (
            <Card>
              <SectionTitle>Deal-breakers</SectionTitle>
              <div className="space-y-3">
                {p.dealbreakers.weather && <Info label="Weather" value={p.dealbreakers.weather} />}
                {p.dealbreakers.other?.length > 0 && (
                  <TagRow label="Other" tags={p.dealbreakers.other} variant="error" />
                )}
              </div>
            </Card>
          )}

          {/* Behavioral patterns */}
          {p.behavioral_patterns && (
            <Card>
              <SectionTitle>Travel Patterns</SectionTitle>
              <div className="space-y-3">
                {p.behavioral_patterns.planning_style && (
                  <Info label="Planning style" value={p.behavioral_patterns.planning_style} />
                )}
                {p.behavioral_patterns.trip_frequency && (
                  <Info label="Frequency" value={p.behavioral_patterns.trip_frequency} />
                )}
                {p.behavioral_patterns.seasonal_preference && (
                  <Info label="Prefers" value={p.behavioral_patterns.seasonal_preference} />
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Edit with AI modal */}
      <Modal
        open={editOpen}
        onClose={() => { setEditOpen(false); refreshProfile(); }}
        title="Edit Profile"
        className="sm:max-w-2xl"
      >
        <div className="h-96">
          <ChatInterface
            conversationType="profile_edit"
            placeholder="What would you like to update? e.g. 'I've started liking mountains more'"
            className="h-full"
          />
        </div>
        <div className="pt-3 border-t border-[#2A2A2A] mt-3">
          <Button variant="primary" size="sm" onClick={refreshProfile}>
            Done — refresh profile
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[#A09A90] text-xs uppercase tracking-wider mb-3">{children}</p>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[#A09A90] text-xs">{label}</p>
      <p className="text-[#F5F0E8] text-sm mt-0.5">{value}</p>
    </div>
  );
}

function TagRow({ label, tags, variant }: { label: string; tags: string[]; variant?: 'default' | 'amber' | 'sage' | 'error' }) {
  return (
    <div>
      <p className="text-[#A09A90] text-xs mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <Badge key={i} variant={variant ?? 'default'}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}

// ─── Profile ────────────────────────────────────────────────────────────────

export interface VisitedPlace {
  place: string;
  when: string | null;
  companions: string | null;
  liked: string[];
  disliked: string[];
  rating: number | null;
  would_revisit: boolean | null;
}

export interface ProfileData {
  traveler_type: string | null;
  traveler_description: string | null;
  destinations: {
    visited: VisitedPlace[];
    wishlist: string[];
    avoid: string[];
  };
  accommodation: {
    preferred_types: string[];
    avoid_types: string[];
    must_haves: string[];
    nice_to_haves: string[];
    budget_per_night_inr: { comfortable: number | null; splurge: number | null };
    booking_platforms_preferred: string[];
  };
  activities: {
    loves: string[];
    likes: string[];
    neutral: string[];
    dislikes: string[];
    pace: string | null;
    morning_person: boolean | null;
    typical_vacation_wake_up: string | null;
  };
  food: {
    preference: string | null;
    adventurous_eater: boolean | null;
    dietary_restrictions: string | null;
    cuisine_favorites: string[];
    food_priority: string | null;
  };
  flights_logistics: {
    seat_preference: string | null;
    airline_preference: string | null;
    direct_flights_only: boolean | null;
    early_morning_flights_ok: boolean | null;
    max_travel_time_one_way_hours: number | null;
    booking_advance: string | null;
    travel_radius: string | null;
  };
  social: {
    typical_companions: string[];
    solo_travel_comfort: string | null;
    crowd_tolerance: string | null;
    photography_priority: string | null;
    shopping_tendency: string | null;
  };
  budget: {
    daily_budget_inr: { comfortable: number | null; splurge: number | null };
    splurge_categories: string[];
    save_categories: string[];
    typical_trip_duration_days: string | null;
  };
  dealbreakers: {
    weather: string | null;
    safety_concerns: string[];
    dietary_dealbreakers: string[];
    other: string[];
  };
  behavioral_patterns: {
    seasonal_preference: string | null;
    planning_style: string | null;
    trip_frequency: string | null;
    trip_timing: string | null;
    advance_booking_tendency: string | null;
  };
}

export interface TravelerProfile {
  id: string;
  user_id: string;
  profile_data: ProfileData;
  traveler_type: string | null;
  traveler_description: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileUpdate = Partial<ProfileData>;

// ─── Trip ────────────────────────────────────────────────────────────────────

export interface ActivityBlock {
  name: string;
  place: string;
  description: string;
  duration_minutes: number;
  travel_time_from_previous_minutes: number;
}

export interface MealRecommendation {
  type: 'breakfast' | 'lunch' | 'dinner';
  restaurant: string;
  what_to_order: string;
  estimated_cost_inr: number;
}

export interface ItineraryDay {
  day: number;
  date: string;
  morning: { activities: ActivityBlock[] };
  afternoon: { activities: ActivityBlock[] };
  evening: { activities: ActivityBlock[] };
  meals: MealRecommendation[];
  daily_cost_estimate_inr: number;
  pro_tips: string[];
}

export interface BudgetEstimate {
  flights_inr: number;
  stay_per_night_inr: number;
  daily_expenses_inr: number;
  total_estimate_inr: number;
}

export interface DestinationCard {
  name: string;
  hook: string;
  why_it_fits: string[];
  weather: string;
  budget_estimate: BudgetEstimate;
  flags: string[];
  duration_fit: string;
}

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  duration_days: number | null;
  companions: string | null;
  status: 'planned' | 'ongoing' | 'completed';
  itinerary: ItineraryDay[] | null;
  destination_options: DestinationCard[] | null;
  budget_estimated: BudgetEstimate | null;
  budget_actual: BudgetEstimate | null;
  rating: number | null;
  feedback: Record<string, unknown> | null;
  profile_updates_applied: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export type TripCreate = Omit<Trip, 'id' | 'created_at' | 'updated_at'>;
export type TripUpdate = Partial<TripCreate>;

// ─── Conversation ────────────────────────────────────────────────────────────

export type ConversationType = 'onboarding' | 'trip_planning' | 'trip_review' | 'profile_edit';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  conversation_type: ConversationType;
  trip_id: string | null;
  messages: Message[];
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ─── AI Response Cards ────────────────────────────────────────────────────────

export interface ParsedSegment {
  type: 'text' | 'json_block';
  content: string;
  data?: unknown;
  blockType?: string;
}

export interface ChatRequest {
  conversationType: ConversationType;
  message: string;
  conversationId?: string;
  tripId?: string;
}

// ─── Auth.js session extension ────────────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

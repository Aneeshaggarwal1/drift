# API Contract — Drift

## Authentication
All routes require an authenticated session (JWT cookie set by Auth.js).
Unauthenticated requests return `{ "error": "Unauthorized" }` with status 401.

---

## POST /api/chat
**Purpose:** Main AI conversation endpoint — streaming SSE response.

**Request body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| conversationType | `"onboarding" \| "trip_planning" \| "trip_review" \| "profile_edit"` | yes | Determines system prompt and AI behavior |
| message | string | yes | User's message text |
| conversationId | string | no | Continue an existing conversation (pass the ID from a previous `done` event) |
| tripId | string | no | Trip context for `trip_planning` and `trip_review` |

**Response:** Server-Sent Events stream (`text/event-stream`)

| Event shape | Description |
|-------------|-------------|
| `{ text: string }` | Incremental text chunk — append to display |
| `{ done: true, conversationId: string }` | Stream complete — save conversationId for continuity |
| `{ error: string }` | Error occurred during streaming |

**Side effects after stream completes:**
- Messages appended to `conversations` table
- If `travel_profile` JSON block in response → profile created/updated automatically
- If `profile_update` JSON block in response → profile fields patched automatically

**AI JSON block types in responses:**
| `type` | Trigger | Shape |
|--------|---------|-------|
| `travel_profile` | End of onboarding | Full `ProfileData` under `data` key |
| `destination_cards` | Trip planning step 2 | `{ data: DestinationCard[] }` |
| `itinerary` | Trip planning step 3 | `{ data: ItineraryDay[] }` |
| `profile_update` | Trip review / profile edit | `{ data: { field_path, old_value, new_value, reason } }` |

---

## GET /api/profile
**Purpose:** Get the authenticated user's traveler profile.

**Response:**
- `200` → `TravelerProfile` object (or `null` if no profile yet)

---

## POST /api/profile
**Purpose:** Create or update profile (called from frontend after onboarding confirmation).

**Request body:**
| Field | Type | Required |
|-------|------|----------|
| profile_data | `ProfileData` | yes |
| traveler_type | string | no |
| traveler_description | string | no |

**Response:**
- `201` → Created `TravelerProfile`
- `200` → Updated `TravelerProfile` (if profile already exists, deep-merges)

---

## PUT /api/profile
**Purpose:** Inline profile edits (from Profile page direct edit).

**Request body:** Partial `ProfileData` — deep-merged with existing profile.

**Response:**
- `200` → Updated `TravelerProfile`
- `404` → Profile not found

---

## GET /api/trips
**Purpose:** List all trips for the authenticated user.

**Query params:**
| Param | Values | Default |
|-------|--------|---------|
| status | `planned \| ongoing \| completed` | all trips |

**Response:** `Trip[]` ordered by created_at desc.

---

## POST /api/trips
**Purpose:** Save a trip (after AI generates itinerary and user confirms).

**Request body:**
| Field | Type | Required |
|-------|------|----------|
| destination | string | yes |
| start_date | string (date) | no |
| end_date | string (date) | no |
| duration_days | number | no |
| companions | string | no |
| status | `"planned" \| "ongoing" \| "completed"` | no (default: `planned`) |
| itinerary | `ItineraryDay[]` | no |
| destination_options | `DestinationCard[]` | no |
| budget_estimated | `BudgetEstimate` | no |

**Response:** `201` → Created `Trip`

---

## GET /api/trips/[id]
**Purpose:** Get a single trip by ID.

**Response:**
- `200` → `Trip`
- `404` → Not found (or not owned by user)

---

## PUT /api/trips/[id]
**Purpose:** Update a trip — rating, feedback, status change, actual budget.

**Request body:** Any subset of:
| Field | Type |
|-------|------|
| status | `"planned" \| "ongoing" \| "completed"` |
| rating | number (1–5) |
| feedback | object |
| budget_actual | `BudgetEstimate` |
| itinerary | `ItineraryDay[]` |

**Response:**
- `200` → Updated `Trip`
- `404` → Not found

---

## Error Response Shape
All error responses follow:
```json
{ "error": "Human-readable message" }
```

---

## TypeScript Types Reference

```typescript
// Full type definitions in /lib/types/index.ts

interface TravelerProfile {
  id: string;
  user_id: string;
  profile_data: ProfileData;
  traveler_type: string | null;
  traveler_description: string | null;
  created_at: string;
  updated_at: string;
}

interface Trip {
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
  created_at: string;
  updated_at: string;
}

interface DestinationCard {
  name: string;
  hook: string;
  why_it_fits: string[];
  weather: string;
  budget_estimate: BudgetEstimate;
  flags: string[];
  duration_fit: string;
}

interface BudgetEstimate {
  flights_inr: number;
  stay_per_night_inr: number;
  daily_expenses_inr: number;
  total_estimate_inr: number;
}
```

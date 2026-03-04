# Cursor Prompt: “Drift” — Personal Travel Companion App

Copy-paste this entire prompt into Cursor’s chat (Cmd+L) in a new Next.js project.

---

Build a personal travel companion app called "Drift" — a conversational AI travel planner that learns my travel personality through a chat-based onboarding, builds a profile, and uses it to recommend destinations and plan personalized trips.

\#\# Tech Stack

\- Next.js 14 with App Router and TypeScript

\- Tailwind CSS for styling

\- Supabase for database and auth (magic link email auth — single user app but auth-protected)

\- Anthropic Claude API for the AI agent (model: claude-sonnet-4-20250514)

\- Environment variables: NEXT\_PUBLIC\_SUPABASE\_URL, NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY, ANTHROPIC\_API\_KEY

\---

\#\# CORE CONCEPT

Two phases:

1\. \*\*Learn\*\* — AI builds a travel personality profile through a natural conversation

2\. \*\*Plan\*\* — AI uses that profile to recommend destinations, generate itineraries, and learn from trip feedback

The profile is the foundation. Every recommendation is personalized based on it.

\---

\#\# PAGE 1: ONBOARDING (\`/onboard\`)

If no traveler profile exists in the database → redirect here from any page.

\#\#\# What It Is:

A full-screen conversational chat interface. The AI agent has a warm, friendly conversation with the user to understand their travel personality. This is NOT a form. It's a real conversation — like a well-traveled friend getting to know you at a dinner party.

\#\#\# How the Conversation Works:

The AI asks about topics one at a time, naturally, with follow-ups based on the user's answers. It should never dump a list of questions. It should never feel like an interview.

\*\*Conversation Flow Example:\*\*

AI: "Hey\! I'm Drift, your personal travel planner. Before I can plan anything amazing for you, I need to get to know how you travel. Let's start easy — tell me about the best trip you've ever taken. What made it special?"

User: "Went to Pondicherry last year with my girlfriend. Loved the French Quarter, cycling around, and the seafood."

AI: "Pondicherry is great for that\! Was it the vibe of the place — that slow, European-town-in-India feel — or more the specific things you did like cycling and food? Trying to understand what really clicked for you."

User: "Both honestly. I like places that have a distinct character. And we're both big foodies so the food scene matters a lot."

AI: "Got it — character and food are big drivers. Now flip side — any trip that really disappointed you?"

...and so on.

\*\*Topics to Cover (in whatever natural order the conversation flows):\*\*

1\. \*\*Travel Highlights & History\*\*

   \- Best trips and what made them great

   \- Worst/disappointing trips and why

   \- Places they'd revisit vs never again

   \- Specific destinations visited (with who, when, what they did)

2\. \*\*Activity & Experience Preferences\*\*

   \- What they enjoy: adventure, trekking, beaches, cultural sites, food trails, nightlife, nature, wildlife, shopping, wellness, photography

   \- Preferred pace: packed schedule vs lazy flexible days

   \- Morning person or late riser on vacation

   \- Importance of trying local food vs familiar options

3\. \*\*Accommodation Preferences\*\*

   \- Style: luxury hotels, boutique stays, homestays, hostels, Airbnbs

   \- Must-haves: location, WiFi, pool, quiet, breakfast

   \- Budget per night (in INR)

4\. \*\*Flight & Logistics\*\*

   \- Seat preference, airline preference (budget vs full service)

   \- Direct flights only or connections ok

   \- Early morning flights acceptable or not

   \- Max acceptable one-way travel time

   \- Booking style: last minute or advance planner

   \- Travel radius: domestic, Asia, worldwide

5\. \*\*Social & Companions\*\*

   \- Who they typically travel with: solo, partner, friends, family

   \- Solo travel comfort level

   \- Crowd tolerance: avoid tourist traps or fine with popular spots

6\. \*\*Budget\*\*

   \- Daily budget comfort zone (INR)

   \- What they splurge on vs where they save

   \- Typical trip duration

7\. \*\*Deal-Breakers\*\*

   \- Weather extremes they can't handle

   \- Safety concerns

   \- Dietary restrictions affecting destination choice

   \- Anything that ruins a trip for them

8\. \*\*Behavioral Patterns\*\*

   \- Seasonal preferences (winter traveler? monsoon avoider?)

   \- Planning style: fully planned vs spontaneous

   \- How often they travel

   \- Long weekends vs proper vacations

\*\*Conversation Rules for the AI:\*\*

\- Ask ONE topic at a time

\- Follow up on interesting details (if they mention Coorg, ask what specifically they loved)

\- Use their previous answers to inform the next question ("Since you mentioned you're a foodie...")

\- Match their tone — casual if they're casual, detailed if they're detailed

\- Don't ask about things they've already answered in passing

\- After 8-15 exchanges, the AI should have enough information

\- When ready, summarize: "Here's what I've learned about you as a traveler" and present the structured profile as visual cards

\- Ask for confirmation: "Does this look right? Anything you'd change?"

\- On confirmation → save profile to Supabase → redirect to home page

\#\#\# Profile JSON Schema (what gets stored):

\`\`\`json

{

  "traveler\_type": "AI-generated label — e.g., 'The Curious Wanderer', 'Adventurous Foodie', 'The Relaxed Explorer'",

  "traveler\_description": "2-3 sentence AI-generated summary of how this person travels",

  "destinations": {

    "visited": \[

      {

        "place": "Pondicherry",

        "when": "Dec 2023",

        "companions": "partner",

        "liked": \["French Quarter cafes", "cycling", "seafood"\],

        "disliked": \["crowded main beach"\],

        "rating": 4,

        "would\_revisit": true

      }

    \],

    "wishlist": \["Japan", "Vietnam"\],

    "avoid": \["place and reason"\]

  },

  "accommodation": {

    "preferred\_types": \["boutique hotels", "homestays"\],

    "avoid\_types": \["large chain resorts"\],

    "must\_haves": \["central location", "good WiFi", "quiet"\],

    "nice\_to\_haves": \["pool", "breakfast included"\],

    "budget\_per\_night\_inr": { "comfortable": 3000, "splurge": 8000 },

    "booking\_platforms\_preferred": \["Booking.com", "Airbnb"\]

  },

  "activities": {

    "loves": \["food trails", "local markets", "hiking", "historical sites"\],

    "likes": \["beaches", "photography walks", "cooking classes"\],

    "neutral": \["shopping", "museums"\],

    "dislikes": \["amusement parks", "guided group tours"\],

    "pace": "relaxed — 2-3 activities per day max",

    "morning\_person": false,

    "typical\_vacation\_wake\_up": "9-10am"

  },

  "food": {

    "preference": "strongly prefers local cuisine over tourist restaurants",

    "adventurous\_eater": true,

    "dietary\_restrictions": "none",

    "cuisine\_favorites": \["South Indian", "Japanese", "Italian"\],

    "food\_priority": "high — would plan a day around a restaurant"

  },

  "flights\_logistics": {

    "seat\_preference": "window",

    "airline\_preference": "budget airlines fine for short haul, full service for 4+ hours",

    "direct\_flights\_only": false,

    "early\_morning\_flights\_ok": false,

    "max\_travel\_time\_one\_way\_hours": 8,

    "booking\_advance": "1-2 months",

    "travel\_radius": "domestic \+ Southeast Asia"

  },

  "social": {

    "typical\_companions": \["partner", "close friends (2-3)"\],

    "solo\_travel\_comfort": "comfortable but prefers company",

    "crowd\_tolerance": "low — avoids peak season and tourist traps",

    "photography\_priority": "medium",

    "shopping\_tendency": "low"

  },

  "budget": {

    "daily\_budget\_inr": { "comfortable": 5000, "splurge": 15000 },

    "splurge\_categories": \["unique experiences", "good food"\],

    "save\_categories": \["flights", "shopping"\],

    "typical\_trip\_duration\_days": "3-5"

  },

  "dealbreakers": {

    "weather": "can't handle extreme heat (40°C+)",

    "safety\_concerns": \[\],

    "dietary\_dealbreakers": \[\],

    "other": \["overly commercialized tourist spots"\]

  },

  "behavioral\_patterns": {

    "seasonal\_preference": "October to March",

    "planning\_style": "semi-planned — rough structure with room for spontaneity",

    "trip\_frequency": "once every 2-3 months",

    "trip\_timing": "long weekends \+ 1-2 leaves",

    "advance\_booking\_tendency": "moderate — 1-2 months ahead"

  }

}

This is the TARGET schema. The AI fills in whatever it can learn from the conversation. Fields it couldn’t learn stay as null — these can be filled later via profile editing.

---

## PAGE 2: HOME PAGE (`/`)

If no profile exists → redirect to `/onboard`.

This is a **chat-first interface**. The primary way the user interacts with the app.

### Layout:

- Full-height chat area taking up most of the screen  
- Sticky input bar at the bottom: text input \+ send button  
- Left sidebar (collapsible, hidden by default on mobile):  
  - “New Trip” button (clears chat, starts fresh planning)  
  - Recent trips (last 5, clickable — opens trip detail)  
  - Link to Profile page  
  - Link to All Trips page

### How Trip Planning Works:

The user types something natural:

- “I have 4 days off around March 20th”  
- “Plan a weekend getaway, I need to unwind”  
- “5 days in May with friends, something adventurous”  
- “Where should I go for New Year’s?”  
- “Something like my Coorg trip but a different place”

**Step 1 — Understand the Request:** The AI parses the message for: dates, duration, companions, mood/vibe, constraints. For anything not mentioned, it uses profile defaults (e.g., if profile says typical companions \= partner, assume that). It does NOT ask a bunch of clarifying questions unless truly critical info is missing (like dates).

**Step 2 — Destination Recommendations:** The AI considers:

- Full travel profile  
- Past trips (avoid repeats unless would\_revisit \= true)  
- Season and weather for those dates  
- Mood/vibe from the message  
- Budget comfort zone

Responds with **2-3 destination options as structured cards** (not plain text). Each card:

- **Destination name**  
- **One-line personalized hook:** “Like Coorg but with better trekking trails and fewer crowds”  
- **Why it fits you:** 2-3 points referencing their profile (“You loved the cycling in Pondicherry — this place has amazing coastal cycling routes”)  
- **Weather:** Approximate conditions for those dates  
- **Budget estimate:** Flights \+ stay \+ daily expenses in INR  
- **Flags:** Honest trade-offs (“Peak season, 30% pricier than usual” or “No direct flights — 1 stop via Bangalore”)  
- **“Pick This” button** on each card

**Step 3 — Itinerary Generation:** After user picks a destination (clicks button or says “let’s go with option 2”):

Generate a day-by-day itinerary that deeply respects the profile:

- Late riser? Nothing before 10am  
- Foodie? Specific restaurant names, not “lunch break”  
- Relaxed pace? Max 2-3 activities per day with buffer time  
- Photographer? Golden hour suggestions built in  
- Budget-conscious? Cost-effective options prioritized

Each day as a **structured card**:

- Day number and date  
- **Morning block** (activities from \~10am-1pm)  
- **Afternoon block** (activities from \~2pm-5pm)  
- **Evening block** (dinner, walks, nightlife)  
- Each activity: specific place name, brief description, estimated time there, travel time from previous spot  
- **Meal recommendations:** specific restaurant/cafe names with what to order  
- **Daily cost estimate** in INR  
- **Pro tips:** “Book this in advance” or “Carry cash” or “Skip if it rains”

**Step 4 — Save Trip:** After itinerary is shown: “Want me to save this trip?” On save → store in Supabase with status “planned”

### AI Response Formatting for Cards:

The AI includes structured JSON blocks within its conversational response. The frontend parser extracts these and renders them as rich cards.

Format:

Here are my top picks for your March trip:

​\`\`\`json

{"type": "destination\_cards", "data": \[

  {

    "name": "Hampi",

    "hook": "History meets bouldering — unlike anything in your travel history",

    "why\_it\_fits": \["You loved cultural exploration in Pondicherry", "Great for photography", "Well within your 5k/day comfort zone"\],

    "weather": "32°C, dry and sunny — warm but manageable",

    "budget\_estimate": {"flights\_inr": 6000, "stay\_per\_night\_inr": 2500, "daily\_expenses\_inr": 3000, "total\_estimate\_inr": 18500},

    "flags": \["Gets hot after 2pm — plan indoor/shaded activities for afternoon"\],

    "duration\_fit": "Perfect for 3-4 days"

  }

\]}

​\`\`\`

I'd personally recommend Hampi as the top pick here. What do you think?

The frontend parser splits the response into text segments and JSON blocks, rendering appropriate card components for each JSON block.

---

## PAGE 3: TRIP HISTORY (`/trips`)

A clean list/grid of all saved trips.

### Layout:

- Filter tabs at top: All / Planned / Completed  
- Grid of trip cards, each showing:  
  - Destination name (large)  
  - Dates  
  - Duration (X days)  
  - Companions  
  - Status badge (Planned / Completed)  
  - Rating (stars, only for completed trips)  
- Click any card → opens trip detail page

### Trip Detail (`/trips/[id]`):

- Header: destination, dates, companions, status  
- Full itinerary as day cards (same format as when AI generated it)  
- Budget section: estimated vs actual (if filled)  
- For completed trips:  
  - **Star rating** (1-5, clickable to rate)  
  - **“How was it?” button** — opens a chat overlay  
  - The review agent asks specific questions: “How was the hotel in Hampi? Would you stay there again?” “Which day was your favorite?” “Anything you’d skip?”  
  - 3-5 exchange conversation  
  - AI extracts feedback, stores it on the trip, and suggests profile updates  
  - E.g., “You mentioned the hotel was too far from the ruins. I’ll weight central location more heavily for historical destinations. Sound right?”  
  - On confirm → updates trip feedback \+ adjusts profile

---

## PAGE 4: PROFILE (`/profile`)

Displays the travel personality as a visual dashboard.

### Layout:

**Header Section:**

- Large traveler type label: “The Curious Wanderer”  
- AI-generated 2-3 sentence description underneath  
- e.g., “You travel to eat, explore, and get lost in places with character. You prefer depth over breadth, quiet over crowds, and a great meal matters more than a fancy hotel. You plan loosely and let the trip surprise you.”

**Profile Categories** — each as a visual card:

- **Places Visited** — grid/list with ratings and would-revisit indicators  
- **Wishlist** — destinations you want to visit  
- **Activities** — loves/likes/dislikes with visual tags  
- **Accommodation** — preferred types, must-haves, budget range  
- **Food & Dining** — preferences, favorites, priority level  
- **Flights & Logistics** — seat pref, airline pref, booking style  
- **Travel Style** — pace, planning style, morning/night person  
- **Companions** — typical travel partners, solo comfort  
- **Budget** — daily ranges, splurge vs save categories  
- **Deal-Breakers** — weather, crowds, other no-gos

### Two Ways to Edit:

**1\. Direct Inline Edit:** Each card has an “Edit” pencil icon. Clicking it makes fields editable:

- Text fields become input fields  
- Tags become removable/addable chips  
- Budget numbers become editable  
- Dropdowns for structured choices  
- “Save” and “Cancel” buttons appear  
- On save → update Supabase

**2\. Chat-Based Edit:** A floating chat button (bottom-right) on the profile page. Opens a chat overlay. User types natural language:

- “I’ve started liking mountains more than beaches”  
- “Add Bali to my wishlist”  
- “My daily budget has gone up to 8k now”  
- “Remove nightlife from my dislikes, I’ve warmed up to it”  
- “I traveled solo last month and actually loved it — update my solo comfort”

The AI processes this and shows what it will change: “Got it\! I’ll make these updates:

- Activities → moved ‘mountains/trekking’ from ‘likes’ to ‘loves’  
- Activities → moved ‘beaches’ from ‘loves’ to ‘likes’ Does that look right?”

On confirm → update Supabase → refresh profile display.

---

## SUPABASE DATABASE SCHEMA

\-- Traveler profile

CREATE TABLE traveler\_profile (

  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

  user\_id UUID REFERENCES auth.users(id) NOT NULL,

  profile\_data JSONB NOT NULL,

  traveler\_type VARCHAR(200),

  traveler\_description TEXT,

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

\-- Trips

CREATE TABLE trips (

  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

  user\_id UUID REFERENCES auth.users(id) NOT NULL,

  destination VARCHAR(200) NOT NULL,

  start\_date DATE,

  end\_date DATE,

  duration\_days INTEGER,

  companions VARCHAR(100),

  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed')),

  itinerary JSONB,

  destination\_options JSONB,

  budget\_estimated JSONB,

  budget\_actual JSONB,

  rating INTEGER CHECK (rating \>= 1 AND rating \<= 5),

  feedback JSONB,

  profile\_updates\_applied JSONB,

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

\-- Conversations

CREATE TABLE conversations (

  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

  user\_id UUID REFERENCES auth.users(id) NOT NULL,

  conversation\_type VARCHAR(30) NOT NULL CHECK (conversation\_type IN ('onboarding', 'trip\_planning', 'trip\_review', 'profile\_edit')),

  trip\_id UUID REFERENCES trips(id),

  messages JSONB NOT NULL DEFAULT '\[\]',

  metadata JSONB,

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

\-- Row Level Security

ALTER TABLE traveler\_profile ENABLE ROW LEVEL SECURITY;

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own profile" ON traveler\_profile FOR ALL USING (auth.uid() \= user\_id);

CREATE POLICY "Users own trips" ON trips FOR ALL USING (auth.uid() \= user\_id);

CREATE POLICY "Users own conversations" ON conversations FOR ALL USING (auth.uid() \= user\_id);

---

## API ROUTES

### `POST /api/chat` — Main AI endpoint (handles all conversation types)

Request:

{

  conversationType: 'onboarding' | 'trip\_planning' | 'trip\_review' | 'profile\_edit'

  message: string

  conversationId?: string  // to continue existing conversation

  tripId?: string          // for trip\_planning and trip\_review

}

Logic:

1. Authenticate the user via Supabase session  
2. Fetch user’s profile (if exists)  
3. Fetch conversation history (if conversationId provided)  
4. Fetch last 5 trips (for trip\_planning context)  
5. Build the system prompt based on conversationType (see AI System Prompts below)  
6. Call Anthropic API with streaming enabled  
7. Append new messages (user \+ assistant) to the conversation in Supabase  
8. If AI response contains profile updates or trip data, apply them  
9. Stream response back to frontend

### `GET /api/profile` — Get user’s profile

### `PUT /api/profile` — Update profile (for direct inline edits)

Request: partial profile\_data JSON to deep-merge with existing.

### `GET /api/trips` — List trips (optional query: status filter)

### `POST /api/trips` — Create trip from AI-generated data

### `PUT /api/trips/[id]` — Update trip (rating, feedback, status change, actual budget)

---

## AI SYSTEM PROMPTS

### Onboarding Agent

You are Drift, a personal travel companion. You're meeting a new user for the first time and your goal is to understand how they travel so you can plan perfect trips for them.

PERSONALITY:

\- Warm, curious, and genuinely interested

\- Like a well-traveled friend at a dinner party, not a survey bot

\- Opinionated — you can share your own travel takes to make it conversational

\- Pick up on cues and dig deeper into interesting details

RULES:

\- Ask ONE topic at a time. Never list multiple questions in one message.

\- Follow up on specifics — if they mention a destination, ask what made it special before moving on.

\- Use their previous answers to transition naturally: "Since you mentioned you're a foodie, I'm curious..."

\- Don't ask about things they've already revealed in passing.

\- Keep your messages concise — 2-4 sentences max per turn.

\- After 8-15 exchanges, you should have enough to build a profile.

TOPICS TO COVER (in whatever natural order the conversation flows):

1\. Past trips — best, worst, memorable moments

2\. Activity preferences — what they love doing on trips

3\. Accommodation style and budget

4\. Food and dining preferences

5\. Flight and logistics preferences

6\. Travel companions

7\. Pace and planning style

8\. Deal-breakers

9\. Wishlist destinations

10\. Seasonal and behavioral patterns

WHEN YOU HAVE ENOUGH INFO:

Summarize what you've learned conversationally, then output the complete profile as a JSON block with type "travel\_profile". The JSON must follow the exact schema provided in the app's profile structure.

Say: "Here's your travel personality based on our conversation. Take a look — anything you'd change?"

Fields you couldn't determine should be set to null.

### Trip Planning Agent

You are Drift, a personal travel planner. You know this user deeply through their travel profile and trip history (both provided below in context).

PERSONALITY:

\- A knowledgeable, opinionated travel friend — not a travel brochure

\- Specific and personal — reference their profile and past trips by name

\- Honest about trade-offs and downsides

\- Decisive — give clear recommendations, don't hedge everything

WHEN THE USER ASKS TO PLAN A TRIP:

Step 1: Parse their request for dates, duration, companions, mood, constraints. For anything not stated, use their profile defaults. Do NOT ask a bunch of clarifying questions — just plan.

Step 2: Recommend 2-3 destinations as a JSON block with type "destination\_cards". Each destination must include:

\- name, hook (one-line personalized pitch), why\_it\_fits (2-3 profile-specific reasons), weather, budget\_estimate (flights \+ stay \+ daily in INR), flags (honest trade-offs), duration\_fit

\- Explain WHY each fits them — reference specific profile preferences and past trip experiences

Step 3: After they pick one, generate a complete itinerary as a JSON block with type "itinerary". Structure:

\- Array of days, each with morning/afternoon/evening blocks

\- Each block: activity name, specific place, description, duration, travel time from previous

\- Meal recommendations with specific restaurant/cafe names

\- Daily cost estimate in INR

\- Pro tips per day

ITINERARY RULES:

\- If they're not a morning person, nothing before 10am

\- If food priority is high, build meals into the experience, not just filler

\- If pace is relaxed, max 2-3 activities per day with free time

\- If they avoid crowds, suggest off-peak timing for popular spots

\- Always include specific place names — never generic suggestions

\- Include practical notes: "book in advance", "carry cash", "skip if raining"

Step 4: Offer to save the trip.

CONTEXT:

User Profile: {profile\_data}

Recent Trips: {recent\_trips}

### Trip Review Agent

You are Drift, collecting feedback on a completed trip.

RULES:

\- Ask about specific things from their itinerary: "How was \[specific hotel name\]?" not generic "How was your stay?"

\- Cover: overall experience, highlight moment, biggest disappointment, would they revisit

\- 3-5 exchanges max — keep it light

\- Based on feedback, suggest profile preference updates

\- Output changes as JSON block with type "profile\_update" — only include fields that should change, with a reason for each

\- Ask for confirmation before applying updates

CONTEXT:

Trip Details: {trip\_data}

User Profile: {profile\_data}

### Profile Edit Agent

You are Drift, processing a profile update request in natural language.

RULES:

\- Parse what the user wants to change

\- Show before → after for each change

\- Ask for confirmation

\- Output as JSON block with type "profile\_update" — only the changed fields

\- Be precise — only change what they explicitly asked for

\- Keep it to 1-2 exchanges

---

## FRONTEND COMPONENTS

### Chat Components

- `ChatInterface.tsx` — Full chat UI: message list with auto-scroll, sticky input bar, handles streaming text display, parses AI responses for JSON blocks and renders cards inline  
- `ChatMessage.tsx` — Single message bubble (user or AI). For AI messages: splits response into text segments and structured card components  
- `DestinationCard.tsx` — Rich destination recommendation card with gradient background, budget breakdown, “Pick This” button  
- `ItineraryDayCard.tsx` — Expandable day card with morning/afternoon/evening blocks, activities, meals, costs  
- `ProfileSummaryCard.tsx` — Shows extracted profile during onboarding, category by category  
- `TypingIndicator.tsx` — Three animated dots while AI is responding

### Profile Components

- `ProfileDashboard.tsx` — Full profile view: header \+ grid of category cards  
- `ProfileCategoryCard.tsx` — Single category card with view/edit modes. View shows formatted data, edit shows inputs/chips/dropdowns  
- `TravelerTypeHeader.tsx` — Large display of type label \+ description  
- `VisitedPlacesGrid.tsx` — Visual list of visited destinations with ratings and revisit badges

### Trip Components

- `TripCard.tsx` — Compact card for trip lists: destination, dates, status badge, rating stars  
- `TripDetail.tsx` — Full trip page: header, itinerary days, budget section  
- `TripReviewChat.tsx` — Chat overlay/modal for post-trip review

### Layout Components

- `AppLayout.tsx` — Main layout wrapper with sidebar \+ content area  
- `Sidebar.tsx` — Left sidebar: New Trip, recent trips, nav links  
- `MobileNav.tsx` — Bottom tab navigation for mobile: Chat, Trips, Profile

### UI Primitives

- `Button.tsx` — Primary, secondary, ghost variants  
- `Card.tsx` — Base card with dark surface styling  
- `Input.tsx` — Text input with label  
- `TextArea.tsx` — Multi-line input  
- `Badge.tsx` — Status badges, tag chips  
- `Modal.tsx` — Overlay modal for reviews and chat edits  
- `StarRating.tsx` — Clickable 1-5 star rating  
- `LoadingDots.tsx` — Animated typing indicator dots

---

## UI/UX SPECIFICATIONS

### Color Theme (Dark):

- Background: \#0F0F0F  
- Card surfaces: \#1A1A1A  
- Card borders: \#2A2A2A  
- Hover states: \#252525  
- Primary accent: warm amber \#E8A838  
- Secondary accent: muted sage \#7C9A6E  
- Text primary: cream \#F5F0E8  
- Text secondary: \#A09A90  
- Error: soft coral \#D4756B  
- Success: \#7C9A6E

### Typography:

- Headings: “Fraunces” (Google Fonts) — serif, warm, distinctive  
- Body text: “Plus Jakarta Sans” (Google Fonts) — clean, modern, readable  
- Monospace (budget numbers, dates): “JetBrains Mono” (Google Fonts)

### Design Rules:

- **Chat-first** — the chat interface is the primary interaction everywhere  
- **Cards over walls of text** — all structured data rendered as visual cards  
- **Warm and personal** — this is a travel companion, not a corporate SaaS tool  
- **Generous whitespace** — no cramped layouts, let content breathe  
- **Mobile-first** — design for phone use, scale up gracefully for desktop  
- **Subtle animations** — fade-in for messages (200ms), slide-up for cards (300ms), smooth transitions between pages  
- **No visual clutter** — every UI element earns its place

### Responsive Breakpoints:

- Mobile (\<768px): full-screen chat, bottom nav, no sidebar, cards stack vertically  
- Tablet (768-1024px): collapsible sidebar, chat takes 70% width  
- Desktop (\>1024px): sidebar always visible, chat centered with max-width 720px

---

## FILE STRUCTURE

/app

  layout.tsx                    \-- Root layout: fonts, Supabase provider, global styles

  page.tsx                      \-- Home page (chat interface \+ sidebar)

  /onboard

    page.tsx                    \-- Onboarding conversational chat

  /trips

    page.tsx                    \-- Trip history list

    /\[id\]/page.tsx              \-- Trip detail \+ review

  /profile

    page.tsx                    \-- Editable profile dashboard

  /api

    /chat/route.ts              \-- Main AI endpoint (streaming)

    /profile/route.ts           \-- GET \+ PUT profile

    /trips/route.ts             \-- GET (list) \+ POST (create)

    /trips/\[id\]/route.ts        \-- GET \+ PUT individual trip

  /auth

    /login/page.tsx             \-- Login page (magic link)

    /callback/route.ts          \-- Supabase auth callback

/components

  /chat

    ChatInterface.tsx

    ChatMessage.tsx

    DestinationCard.tsx

    ItineraryDayCard.tsx

    ProfileSummaryCard.tsx

    TypingIndicator.tsx

  /profile

    ProfileDashboard.tsx

    ProfileCategoryCard.tsx

    TravelerTypeHeader.tsx

    VisitedPlacesGrid.tsx

  /trips

    TripCard.tsx

    TripDetail.tsx

    TripReviewChat.tsx

  /ui

    Button.tsx

    Card.tsx

    Input.tsx

    TextArea.tsx

    Badge.tsx

    Modal.tsx

    StarRating.tsx

    LoadingDots.tsx

  /layout

    AppLayout.tsx

    Sidebar.tsx

    MobileNav.tsx

/lib

  /ai

    agent.ts                    \-- System prompt builder \+ Anthropic API call logic

    parser.ts                   \-- Extract JSON blocks from AI response, route to card types

    streaming.ts                \-- SSE streaming handler for API route \+ frontend consumer

  /supabase

    client.ts                   \-- Browser Supabase client

    server.ts                   \-- Server Supabase client (for API routes)

    middleware.ts               \-- Auth session checker

    queries.ts                  \-- All DB operations: getProfile, updateProfile, getTrips, createTrip, etc.

  /types

    index.ts                    \-- TypeScript interfaces: TravelerProfile, Trip, Message, Conversation, DestinationCard, ItineraryDay, etc.

  /utils

    dates.ts                    \-- Format dates, calculate durations

    budget.ts                   \-- Format INR (₹5,000), calculate totals

    cn.ts                       \-- clsx \+ tailwind-merge utility

/middleware.ts                  \-- Next.js middleware: redirect unauthenticated users to /auth/login, redirect users without profile to /onboard

---

## IMPLEMENTATION ORDER

Build in this exact sequence. Each step should be testable before moving to the next.

1. **Project scaffolding** — Tailwind config with custom colors/fonts, Google Fonts setup, global CSS, base layout with dark theme  
2. **Supabase setup** — Client initialization (browser \+ server), environment variables, auth helper functions  
3. **Auth flow** — Login page with magic link, callback route, middleware for protected routes, session management  
4. **TypeScript types** — All interfaces matching the profile JSON schema, trip schema, message schema, card data schemas  
5. **Supabase query helpers** — getProfile, createProfile, updateProfile, getTrips, createTrip, updateTrip, getConversation, saveMessages  
6. **AI infrastructure** — Anthropic SDK setup, system prompt builder function (takes conversationType \+ context, returns full system prompt), streaming response handler  
7. **Response parser** — Function that takes raw AI text, splits into segments: plain text portions and parsed JSON blocks with type field. Handle malformed JSON gracefully.  
8. **UI primitives** — Button, Card, Input, TextArea, Badge, Modal, StarRating, LoadingDots components  
9. **Chat interface** — ChatInterface \+ ChatMessage components with streaming display, auto-scroll, input handling  
10. **Onboarding page** — Full onboarding flow: chat with AI, profile extraction, confirmation, save to Supabase, redirect  
11. **Profile page** — ProfileDashboard with all category cards, inline editing mode, chat-based editing with floating button  
12. **Home page** — Trip planning chat, destination card rendering, itinerary card rendering  
13. **Trip saving** — Save trip flow, status management  
14. **Trip history page** — Trip list with filters, trip detail page with full itinerary display  
15. **Trip review** — Review chat overlay, feedback extraction, profile update suggestions  
16. **Polish** — Loading states on all pages, error handling in chat (“Something went wrong, try again”), empty states (“No trips yet — let’s plan your first one\!”), page transitions, mobile responsiveness testing

---

## CRITICAL IMPLEMENTATION NOTES

1. **Streaming responses** — Use Anthropic’s streaming API. Create a ReadableStream in the API route that forwards chunks. On the frontend, consume the stream and update the message display character by character. JSON blocks should only render as cards after the complete block is received (detect closing \`\`\` markers).  
2. **JSON block parsing** — The AI will embed JSON inside markdown code blocks marked as \`\`\`json. Your parser must:  
- Find all `json ...`  blocks in the response  
- Extract and JSON.parse each block  
- Check for a “type” field to determine which card component to render  
- Replace the JSON block in the text with a placeholder that the ChatMessage component maps to the rendered card  
- If JSON is malformed, fall back to showing it as plain text  
1. **Profile as AI context** — For trip\_planning and trip\_review conversations, always inject the full profile\_data and the last 5 trips into the system prompt. This is what makes everything personal. Format it clearly in the system prompt so the AI can reference specific preferences.  
2. **Deep merge for profile updates** — When the AI suggests profile changes or the user edits inline, deep-merge with existing profile — never replace the whole object. Use a recursive merge utility that handles arrays (append new items, don’t replace) and nested objects.  
3. **Conversation continuity** — Store all messages in Supabase conversations table. When the user continues a trip planning conversation, load full history and send it with the API call so the AI has context of what was already discussed.  
4. **Middleware redirects** — Three states to handle:  
- Not authenticated → redirect to /auth/login  
- Authenticated but no profile → redirect to /onboard  
- Authenticated with profile → allow access to all pages  
1. **Budget formatting** — Always display money as ₹X,XXX format. Create a formatINR() utility used everywhere. Never show raw numbers.  
2. **Mobile experience** — The chat input must stay visible above the keyboard on mobile. Use `dvh` units and proper viewport handling. Bottom nav should hide when keyboard is open.  
3. **Error states** — Every API call wrapped in try/catch. In chat: show friendly error in a system message bubble (“I got a bit confused there. Can you try that again?”). On pages: show retry buttons, never blank screens.  
4. **Optimistic UI** — User message appears instantly in chat. Typing indicator shows immediately. Trip save shows success state before API confirms. Sidebar updates immediately when a new trip is saved.

Begin building now. Start with step 1 and work through sequentially.

\---

\#\# BEFORE YOU PASTE THIS INTO CURSOR

1\. Create the project:

   \`\`\`bash

   npx create-next-app@latest drift \--typescript \--tailwind \--app \--src=no

   cd drift

   npm install @supabase/supabase-js @anthropic-ai/sdk

1. Create Supabase project at supabase.com and run the SQL schema above  
     
2. Get Anthropic API key from console.anthropic.com  
     
3. Create `.env.local`:  
     
   NEXT\_PUBLIC\_SUPABASE\_URL=your\_url  
     
   NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=your\_key  
     
   ANTHROPIC\_API\_KEY=your\_key  
     
4. Open the `drift` folder in Cursor  
     
5. Press Cmd+L to open chat, paste the entire prompt above

---

## FOLLOW-UP PROMPTS FOR CURSOR (use after initial build)

**If onboarding feels robotic:** “The onboarding conversation feels like a survey. Make the AI reference my previous answers, react with personality, and transition between topics naturally. It should feel like chatting with a friend, not answering questions.”

**If cards look generic:** “Make the destination and itinerary cards more visually rich. Add subtle gradient backgrounds (warm tones for beach destinations, cool for mountains), small icon accents for activity types, better typography hierarchy, and a smooth slide-up animation when cards appear in the chat.”

**If streaming doesn’t work well:** “Fix the streaming implementation. Use proper Server-Sent Events from the API route. Text should appear smoothly word by word. JSON blocks should accumulate silently and render as complete cards only when the full block is received.”

**To add itinerary export:** “Add the ability to export any saved trip itinerary as a clean PDF. Include the Drift logo, trip details header, and all day cards formatted for print. Add a ‘Download PDF’ button on the trip detail page.”

**To add destination comparison:** “Add a feature where I can say ‘compare Hampi vs Gokarna for this weekend’ and the AI returns a side-by-side comparison card scoring each destination on my key preferences.”

**To improve profile page:** “The profile page needs a visual overhaul. Add a world map at the top showing pins for all visited destinations. Make the traveler type section more prominent with a large card and illustration. Add subtle animations when switching between view and edit modes.”

# Drift — Tech Stack Revision: Supabase → Neon \+ Auth.js \+ Resend

This document lists every change needed in the original Drift spec to replace Supabase with Neon Postgres \+ Auth.js \+ Resend. Use this alongside the original spec — everything not mentioned here stays the same.

---

## 1\. Tech Stack (replaces original)

\- Next.js 14 with App Router and TypeScript

\- Tailwind CSS for styling

\- Neon Postgres (serverless) for database

\- Auth.js v5 (NextAuth) with Resend provider for magic link email auth

\- Anthropic Claude API for the AI agent (model: claude-sonnet-4-20250514)

\- Environment variables:

    DATABASE\_URL          — Neon Postgres connection string

    AUTH\_SECRET           — Auth.js encryption secret

    AUTH\_RESEND\_KEY       — Resend API key for sending magic link emails

    ANTHROPIC\_API\_KEY     — Claude API key

**Dependencies to install:**

npx create-next-app@latest drift \--typescript \--tailwind \--app \--src=no

cd drift

npm install @neondatabase/serverless next-auth@beta @auth/pg-adapter @anthropic-ai/sdk clsx tailwind-merge

---

## 2\. Database Schema (replaces original SQL section)

\-- \=============================================

\-- Auth.js required tables

\-- \=============================================

CREATE TABLE users (

  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

  name VARCHAR(255),

  email VARCHAR(255) UNIQUE,

  "emailVerified" TIMESTAMPTZ,

  image TEXT

);

CREATE TABLE accounts (

  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type VARCHAR(255) NOT NULL,

  provider VARCHAR(255) NOT NULL,

  "providerAccountId" VARCHAR(255) NOT NULL,

  refresh\_token TEXT,

  access\_token TEXT,

  expires\_at BIGINT,

  token\_type VARCHAR(255),

  scope VARCHAR(255),

  id\_token TEXT,

  session\_state VARCHAR(255)

);

CREATE TABLE sessions (

  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

  "sessionToken" VARCHAR(255) NOT NULL UNIQUE,

  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  expires TIMESTAMPTZ NOT NULL

);

CREATE TABLE verification\_token (

  identifier VARCHAR(255) NOT NULL,

  token VARCHAR(255) NOT NULL UNIQUE,

  expires TIMESTAMPTZ NOT NULL,

  PRIMARY KEY (identifier, token)

);

\-- \=============================================

\-- Application tables (same structure, new FK target)

\-- \=============================================

\-- Traveler profile (references users table, not auth.users)

CREATE TABLE traveler\_profile (

  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

  user\_id UUID REFERENCES users(id) NOT NULL,

  profile\_data JSONB NOT NULL,

  traveler\_type VARCHAR(200),

  traveler\_description TEXT,

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

\-- Trips

CREATE TABLE trips (

  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

  user\_id UUID REFERENCES users(id) NOT NULL,

  destination VARCHAR(200) NOT NULL,

  start\_date DATE,

  end\_date DATE,

  duration\_days INTEGER,

  companions VARCHAR(100),

  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ongoing', 'completed')),

  itinerary JSONB,

  destination\_options JSONB,

  budget\_estimated JSONB,

  budget\_actual JSONB,

  rating INTEGER CHECK (rating \>= 1 AND rating \<= 5),

  feedback JSONB,

  profile\_updates\_applied JSONB,

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

\-- Conversations

CREATE TABLE conversations (

  id UUID DEFAULT gen\_random\_uuid() PRIMARY KEY,

  user\_id UUID REFERENCES users(id) NOT NULL,

  conversation\_type VARCHAR(30) NOT NULL CHECK (conversation\_type IN ('onboarding', 'trip\_planning', 'trip\_review', 'profile\_edit')),

  trip\_id UUID REFERENCES trips(id),

  messages JSONB NOT NULL DEFAULT '\[\]',

  metadata JSONB,

  created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  updated\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

\-- NOTE: No RLS policies. Data isolation is handled in application code.

\-- Every query function in lib/db/queries.ts MUST filter by user\_id.

---

## 3\. Auth Flow (replaces original)

**Login page (`/auth/login`):**

- Single email input \+ "Send Magic Link" button  
- Calls `signIn('resend', { email, callbackUrl: '/' })` from Auth.js  
- After submit: shows "Check your email for a magic link" message  
- Styled to match Drift's dark theme

**Auth callback:**

- Auth.js handles this automatically via `/api/auth/[...nextauth]/route.ts`  
- No custom callback route needed (unlike Supabase)

**Session access in API routes:**

// Old (Supabase):

const { data: { user } } \= await supabase.auth.getUser();

// New (Auth.js):

import { auth } from '@/lib/auth';

const session \= await auth();

const userId \= session?.user?.id;

**Session access in client components:**

// Old (Supabase):

const { data: { session } } \= await supabase.auth.getSession();

// New (Auth.js):

import { useSession } from 'next-auth/react';

const { data: session } \= useSession();

---

## 4\. API Route Authentication (replaces original pattern)

Every API route now uses this pattern:

import { auth } from '@/lib/auth';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

  // 1\. Auth check

  const session \= await auth();

  if (\!session?.user?.id) {

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  }

  const userId \= session.user.id;

  // 2\. Database operation (always pass userId)

  const data \= await getTrips(userId);

  // 3\. Return response

  return NextResponse.json(data);

}

The `POST /api/chat` streaming endpoint uses the same auth pattern at the top, then proceeds with AI streaming as before.

---

## 5\. Database Query Pattern (replaces Supabase client calls)

// Old (Supabase):

const { data, error } \= await supabase

  .from('traveler\_profile')

  .select('\*')

  .eq('user\_id', userId)

  .single();

// New (Neon):

import { getDb } from '@/lib/db';

const sql \= getDb();

const result \= await sql\`

  SELECT \* FROM traveler\_profile

  WHERE user\_id \= ${userId}

  LIMIT 1

\`;

const profile \= result\[0\] || null;

// Old (Supabase insert):

const { data } \= await supabase

  .from('trips')

  .insert({ user\_id: userId, destination, status: 'planned', itinerary })

  .select()

  .single();

// New (Neon insert):

const sql \= getDb();

const result \= await sql\`

  INSERT INTO trips (user\_id, destination, status, itinerary)

  VALUES (${userId}, ${destination}, 'planned', ${JSON.stringify(itinerary)})

  RETURNING \*

\`;

const trip \= result\[0\];

**JSONB handling:** When inserting or updating JSONB columns, wrap the value in `JSON.stringify()`. When reading, Neon returns it as a parsed JS object automatically.

---

## 6\. Middleware (replaces original)

// middleware.ts

import { auth } from '@/lib/auth';

import { NextResponse } from 'next/server';

export default auth((req) \=\> {

  const { pathname } \= req.nextUrl;

  const isLoggedIn \= \!\!req.auth;

  // Allow auth routes through

  if (pathname.startsWith('/auth') || pathname.startsWith('/api/auth')) {

    return NextResponse.next();

  }

  // Redirect unauthenticated users

  if (\!isLoggedIn) {

    return NextResponse.redirect(new URL('/auth/login', req.url));

  }

  return NextResponse.next();

});

export const config \= {

  matcher: \['/((?\!\_next/static|\_next/image|favicon.ico).\*)'\],

};

**Profile redirect** (no profile → /onboard) is handled in the home page server component, not middleware:

// app/page.tsx

import { auth } from '@/lib/auth';

import { redirect } from 'next/navigation';

import { getProfile } from '@/lib/db/queries';

export default async function HomePage() {

  const session \= await auth();

  if (\!session?.user?.id) redirect('/auth/login');

  const profile \= await getProfile(session.user.id);

  if (\!profile) redirect('/onboard');

  // ... render home page

}

---

## 7\. File Structure Changes

 /app

   /auth

\-    /callback/route.ts          \-- Supabase auth callback

\+    /login/page.tsx             \-- Magic link login form

   /api

\+    /auth/\[...nextauth\]/route.ts \-- Auth.js catch-all handler

     /chat/route.ts

     /profile/route.ts

     /trips/route.ts

     /trips/\[id\]/route.ts

 /lib

\-  /supabase

\-    client.ts                   \-- Browser Supabase client

\-    server.ts                   \-- Server Supabase client

\-    middleware.ts               \-- Auth session checker

\-    queries.ts                  \-- DB operations

\+  auth.ts                       \-- Auth.js config (Neon adapter \+ Resend)

\+  auth-helpers.ts               \-- getCurrentUser() utility

\+  /db

\+    index.ts                    \-- Neon serverless query client

\+    pool.ts                     \-- Connection pool (for Auth.js adapter)

\+    queries.ts                  \-- All DB operations (always filter by userId)

   /ai

     agent.ts                    \-- Same as before

     parser.ts                   \-- Same as before

     streaming.ts                \-- Same as before

   /types

     index.ts                    \-- Same \+ Auth.js session type extension

---

## 8\. What Does NOT Change

Everything else in the original Drift spec stays exactly the same:

- All page layouts and UI/UX specifications  
- Color theme, typography, responsive breakpoints  
- All component designs (ChatInterface, DestinationCard, etc.)  
- AI system prompts (onboarding, trip planning, trip review, profile edit)  
- Profile JSON schema  
- Trip planning flow and conversation logic  
- Itinerary generation format  
- Implementation order (just substitute auth steps)  
- All UI primitives and design rules  
- Streaming response format and JSON block parsing

---

## 9\. Setup Steps for a New Machine

1. Create Neon account at **neon.tech** → create project → copy connection string  
2. Create Resend account at **resend.com** → create API key  
3. Get Anthropic key from **console.anthropic.com**  
4. Run `npx auth secret` to generate AUTH\_SECRET  
5. Create project:  
     
   npx create-next-app@latest drift \--typescript \--tailwind \--app \--src=no  
     
   cd drift  
     
   npm install @neondatabase/serverless next-auth@beta @auth/pg-adapter @anthropic-ai/sdk clsx tailwind-merge  
     
6. Add `.env.local` with all four keys  
7. Run `docs/SCHEMA.sql` in Neon dashboard SQL editor  
8. Copy `drift-skills/` into project root  
9. Copy `drift-skills/CLAUDE.md` to project root  
10. Save original Drift spec \+ this revision as `docs/PRD.md`  
11. Start building: tell Claude Code to read the orchestrator and start Phase 2


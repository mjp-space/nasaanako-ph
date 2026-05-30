# NasaanAko.ph — Technical Documentation

> Last updated: May 30, 2026  
> Maintainer: Mark Jude Presnilla (markjudepresnilla@gmail.com)

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Environment Variables](#environment-variables)
5. [Database Schema (Supabase)](#database-schema)
6. [Key Features & How They Work](#key-features)
7. [Google Maps / Street View](#google-maps--street-view)
8. [Locations System](#locations-system)
9. [Scoring System](#scoring-system)
10. [Authentication](#authentication)
11. [Deployment](#deployment)
12. [Update Checklists](#update-checklists)
13. [Known Limitations](#known-limitations)

---

## Overview

**NasaanAko.ph** is a GeoGuessr-style geography guessing game for the Philippines. Players are dropped into a random Google Street View location anywhere in the Philippines and must guess where they are by dropping a pin on a map. Points are awarded based on distance accuracy.

- **Domain:** nasaanako.ph
- **Registrar:** dot.ph
- **Hosting:** Vercel
- **Backend:** Supabase
- **Maps:** Google Maps JavaScript API + Street View API

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16.2.6 (App Router) | Frontend + routing |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS v4 + inline styles | UI |
| Database | Supabase (PostgreSQL) | Auth, profiles, scores |
| Maps | Google Maps JavaScript API | Street View + guess map |
| Hosting | Vercel | CI/CD + edge deployment |
| Domain | dot.ph | nasaanako.ph |
| Version Control | GitHub | Source of truth |

---

## Project Structure

```
nasaanako-nextjs/
├── app/
│   ├── page.tsx          # Landing page (hero, how-to, leaderboard)
│   ├── modes/page.tsx    # Game mode selection (Lakbay, coming soon modes)
│   ├── play/page.tsx     # Main game screen (Street View + guess map + scoring)
│   ├── auth/page.tsx     # Sign up / Log in page
│   ├── layout.tsx        # Root layout (CSS variables, fonts)
│   └── globals.css       # Global styles + CSS custom properties
├── lib/
│   ├── locations.js      # 300+ PH Street View locations + daily seeding logic
│   └── supabase.js       # Supabase client + all DB helper functions
├── public/
│   └── audio/            # Sound effects (background music, pin drop, score fx)
├── .env.local            # Secret keys (never commit this)
├── next.config.ts
└── TECHNICAL.md          # This file
```

---

## Environment Variables

Stored in `.env.local` locally and in **Vercel → Settings → Environment Variables** for production.

| Variable | Where to get it | What it does |
|----------|----------------|--------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Cloud Console → APIs & Services → Credentials | Loads Maps JS API + Street View |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Connects to Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | Public anon key for client-side queries |

> ⚠️ All three are `NEXT_PUBLIC_` so they are exposed to the browser — this is intentional and safe for these key types. Never put a Supabase service role key as `NEXT_PUBLIC_`.

---

## Database Schema

### Table: `profiles`

Created automatically on sign-up. One row per user.

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  total_score integer default 0,
  best_score integer default 0,
  games_played integer default 0,
  tier text default 'Chill Traveler',
  created_at timestamptz default now()
);
```

### Table: `games`

One row per completed game session.

```sql
create table games (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  total_score integer,
  rounds_played integer,
  accuracy integer,
  avg_distance_km float,
  mode text default 'lakbay',   -- 'daily' | 'freeplay'
  played_at timestamptz default now()
);
```

### View: `leaderboard`

Used by the homepage and in-game widget. Ordered by `total_score`.

```sql
create or replace view leaderboard as
  select
    row_number() over (order by total_score desc) as rank,
    display_name,
    username,
    tier,
    best_score,
    total_score,
    games_played
  from profiles
  order by total_score desc
  limit 100;
```

### Row Level Security (RLS)

```sql
-- Profiles: anyone can read, only owner can write
alter table profiles enable row level security;
create policy "Public leaderboard" on profiles for select using (true);
create policy "Users manage own profile" on profiles for all using (auth.uid() = id);

-- Games: only owner can read/write
alter table games enable row level security;
create policy "Users manage own games" on games for all using (auth.uid() = user_id);
```

---

## Key Features

### Game Loop (`app/play/page.tsx`)

1. Google Maps JS API loads via `<script>` tag injected into `<head>`
2. `StreetViewService.getPanorama()` checks if a location has coverage within 1km before loading — silently skips to the next location if not
3. Player drops a pin on the minimap → submits guess
4. Haversine distance is calculated between guess and actual coordinates
5. Score = `min(5000, max(0, 5000 × (1 − dist/400)²))`
6. After round 5 → Final screen → score saved to Supabase
7. Player can continue in Free Play mode (rounds keep incrementing)

### Rounds

- **Rounds 1–5:** Standard game, ends with a final score screen
- **Free Play:** After round 5, game continues indefinitely with random locations
- Round counter in header shows current round number only (no `/5`)

### Leaderboard

- **In-game widget** (top-right): Shows top 3 players with total score, dismissible with ✕
- **Ticker strip**: Scrolls the same top 3 above the minimap
- **Homepage leaderboard**: Shows top 10 with total score + rounds played
- All leaderboard queries filter out players with `total_score = 0`

---

## Google Maps / Street View

### API Key Setup (Google Cloud Console)

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. The API key used: `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
3. **Required APIs** (must be enabled):
   - Maps JavaScript API
   - Street View API
4. **HTTP Referrer Restrictions** currently allowlisted:
   - `*.nasaanako.ph/*`
   - `nasaanako.ph/*`
   - `nasaanako-ph.vercel.app/*`
   - `http://localhost:3000/*`
   - `localhost/*`

### Script Loading

The Maps script is loaded once in `play/page.tsx` using a `useEffect`. A guard checks `document.querySelector('script[src*="maps.googleapis.com"]')` to prevent double-loading (common issue with Next.js navigation). If the script already exists, it polls every 100ms until `window.google.maps` is ready.

The guess map initializes with an 80ms delay after Maps loads to ensure the flex container has real pixel dimensions before Google Maps paints. A `resize` event is also triggered after init and whenever the leaderboard ticker appears/disappears.

---

## Locations System (`lib/locations.js`)

### Structure

```js
{ lat: 14.5895, lng: 120.9750, name: "Intramuros, Manila", hint: "Historic walled city" }
```

- **~302 locations** covering all major regions, provinces, and cities
- Organized by region: Metro Manila → Luzon → Visayas → Mindanao → Palawan

### Functions

```js
// Random locations (used by Free Play and standard rounds)
getRandomLocations(count = 5, exclude = [])

// Date-seeded locations — same 5 spots for all players on the same day (PH time)
// Currently unused in-game but available for Daily Challenge feature
getDailyLocations(count = 5)
```

### Adding New Locations

Add an entry to the `LOCATIONS` array in `lib/locations.js`:
```js
{ lat: XX.XXXX, lng: XXX.XXXX, name: "Location Name, Province", hint: "Short descriptor" }
```

> ⚠️ Not all coordinates have Street View coverage. The game uses `StreetViewService.getPanorama()` with a 1km radius fallback — bad coordinates are silently skipped. Still, test new locations in Google Maps Street View before adding.

---

## Scoring System

| Distance | Points |
|----------|--------|
| Exact (0km) | 5,000 |
| ≤ ~45km | 4,000+ |
| ≤ ~90km | 3,000+ |
| ≤ ~145km | 2,000+ |
| ≤ ~215km | 1,000+ |
| Outside PH bounds | 0 |

**Formula:** `score = min(5000, max(0, 5000 × max(0, 1 − dist/400)²))`

**PH bounds check:** `lat: 4.5–21.5, lng: 116.0–127.5` — pins outside this box score 0.

### Tier System

Tiers are based on cumulative `total_score` across all games:

| Tier | Threshold |
|------|-----------|
| Chill Traveler | 0 – 49,999 |
| Lagalag | 50,000 – 99,999 |
| Pusang Gala | 100,000+ |

Tiers are updated in the `profiles` table after every saved game.

---

## Authentication

Auth uses **Supabase Auth** with a username/password trick — usernames are stored as `username@nasaanako.ph` emails internally so players only need to enter a username (no real email required).

### Flow

1. **Sign Up:** `signUp(username, displayName, password)` → creates auth user + inserts `profiles` row
2. **Log In:** `signIn(username, password)` → signs in with `username@nasaanako.ph`
3. **Guest Play:** Fully supported — scores are not saved. Final screen shows inline sign-up/login form to save the just-completed game without navigating away.
4. **Session:** Managed by `supabase.auth.getSession()` on page load

### Inline Auth on Final Screen

Rather than linking to `/auth` (which loses game state), the final screen has an embedded sign-up/login form. After auth succeeds, the score is immediately saved using the in-memory `totalScore` value.

---

## Deployment

### Stack

```
GitHub (source) → Vercel (build + host) ← dot.ph DNS → nasaanako.ph
```

### Deploy Process

Every `git push` to the `main` branch triggers an automatic Vercel deployment.

```bash
git add .
git commit -m "your message"
git push
```

Vercel builds with `next build` and deploys to the edge. Build time is typically 1–2 minutes.

### DNS Configuration (dot.ph → Vercel)

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

### Vercel Environment Variables

Set in Vercel → Project → Settings → Environment Variables:
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Update Checklists

### ✅ Adding New Game Locations

- [ ] Find coordinates in Google Maps (right-click → copy lat/lng)
- [ ] Verify Street View exists at that spot
- [ ] Add entry to `LOCATIONS` array in `lib/locations.js`
- [ ] `git push` to deploy

### ✅ Adding a New Game Mode

- [ ] Add entry to `MODES` array in `app/modes/page.tsx` with `active: false` initially
- [ ] Create `app/[modename]/page.tsx` (copy `play/page.tsx` as base)
- [ ] Add mode-specific location filtering in `startRound()`
- [ ] Set `active: true` in modes array when ready
- [ ] Update `saveGame()` call with the new mode string

### ✅ Updating the Tier System

- [ ] Edit `getTier()` in `lib/supabase.js`
- [ ] Update thresholds in `saveGame()` → `tier:` field
- [ ] Run SQL to backfill existing profiles if needed:
  ```sql
  update profiles set tier =
    case
      when total_score >= 100000 then 'Pusang Gala'
      when total_score >= 50000  then 'Lagalag'
      else 'Chill Traveler'
    end;
  ```

### ✅ Rotating or Adding API Keys

- [ ] Generate new key in Google Cloud Console
- [ ] Add referrer restrictions (nasaanako.ph/*, localhost)
- [ ] Update `NEXT_PUBLIC_GOOGLE_MAPS_KEY` in Vercel env vars
- [ ] Trigger a redeploy (push an empty commit or use Vercel dashboard)
- [ ] Verify old key is deleted/disabled

### ✅ Updating Supabase Schema

- [ ] Write migration SQL
- [ ] Test in Supabase SQL Editor on the live project (no staging env currently)
- [ ] Update any affected queries in `lib/supabase.js`
- [ ] Update TypeScript types if needed in `app/play/page.tsx`
- [ ] `git push` to deploy

### ✅ Pre-Launch Checklist (for future features)

- [ ] Test on mobile (iPhone 14 viewport, 390px)
- [ ] Test auth: sign up → play → score saves → leaderboard shows
- [ ] Test guest play → inline auth on final screen → score saves
- [ ] Verify Google Maps API referrer allowlist includes new domain
- [ ] Verify all env vars present in Vercel
- [ ] Check Supabase RLS policies are enabled
- [ ] Push to GitHub → confirm Vercel auto-deploys

---

## Known Limitations

| Issue | Status | Notes |
|-------|--------|-------|
| Street View gaps | Mitigated | 1km radius fallback + 8s timeout auto-skip for truly bad locations |
| ~302 locations | Acceptable | Expands automatically — add to `locations.js` |
| No email auth | By design | Username-only UX — usernames stored as `@nasaanako.ph` emails |
| No daily challenge enforcement | Intentional | `getDailyLocations()` exists but not activated — all rounds are random |
| No duplicate round prevention across sessions | Low priority | Same location can appear in different game sessions |
| Single Supabase project (no staging) | Low priority | Test schema changes carefully before running in SQL Editor |

---

## Session Log — May 30, 2026

Full build session from prototype to live production. Summary of everything done:

### What Was Built
- Converted static HTML prototype → full Next.js 16 app with TypeScript + Tailwind
- Pages: `/` (landing), `/modes` (game mode picker), `/play` (game), `/auth` (sign up/login)
- Supabase auth, profiles, games tables, leaderboard view — all wired up
- Google Maps JavaScript API + Street View — script injection with double-load guard
- 302 PH locations across all regions in `lib/locations.js`
- Scoring: Haversine distance, 0–5000 pts per round, tier system
- Sound effects: background music, pin drop, good/bad/perfect score, round start

### Key Fixes Applied
- **RefererNotAllowedMapError** — added `localhost:3000` to Google Cloud API key allowlist
- **Maps double-load** — guard checks `document.querySelector('script[src*="maps.googleapis.com"]')` before injecting
- **Blank/black map on mobile** — 300ms init delay + `resize` event trigger after map container paints
- **Street View black screen** — `StreetViewService.getPanorama()` pre-checks coverage within 1km; added loading spinner + 8s timeout auto-skip fallback
- **Score resets to 0 on sign-in** — header now shows profile `total_score` from Supabase, not session score
- **Leaderboard showing 0-score players** — filtered out with `.gt('total_score', 0)`
- **`useSearchParams` build error** — wrapped in `<Suspense>` in `auth/page.tsx`
- **Vercel 404 after deploy** — Framework Preset was blank ("Other"), fixed to Next.js

### Current State (as of end of session)
- ✅ Live at `nasaanako.ph` (www.nasaanako.ph)
- ✅ Vercel auto-deploys on `git push` to `main`
- ✅ Supabase: profiles + games + leaderboard view with RLS
- ✅ Auth: sign up, log in, guest play, inline auth on final screen
- ✅ Leaderboard: homepage top 10 + in-game widget top 3 + scrolling ticker
- ✅ Mobile: responsive layout for iPhone 14+, `100dvh` for Safari
- ✅ 302 locations across all PH regions
- ✅ Street View loading spinner + 8s timeout auto-skip

### Pending / Next Session
- [ ] Test Street View black screen fix on mobile with real users
- [ ] Expand locations beyond 302 (verify Street View coverage)
- [ ] Activate Daily Challenge mode (code ready in `getDailyLocations()`)
- [ ] Add more game modes (Pamana, Kalikasan, Sikat — currently "Coming Soon")
- [ ] Add `og:image` and meta tags for social sharing
- [ ] Consider upgrading `google.maps.Marker` → `AdvancedMarkerElement` (deprecated warning)
- [ ] Add email-based auth option (currently username-only)
- [ ] Monitor Supabase usage and Vercel bandwidth as player base grows

### How to Resume Development
1. Open terminal → `cd ~/Documents/Claude/Projects/nasaanako-nextjs`
2. Run `npm run dev` → open `localhost:3000`
3. Make changes → `git add . && git commit -m "..." && git push`
4. Vercel auto-deploys in ~2 minutes

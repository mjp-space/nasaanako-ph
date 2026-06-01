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

| Rank | Tier |
|------|------|
| #1 | Pusang Gala |
| #2 | Lagalag |
| #3 | Chill Traveler |
| #4–10 | Mausisa |
| #11+ | Baguhan |

Tiers are rank-based and recalculate for ALL players after every round save.

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

## All Keys & Connections (DO NOT SHARE PUBLICLY)

| Service | Key / Value |
|---------|-------------|
| Supabase Project ID | `aicxenaipzrzbfytdmpe` |
| Supabase URL | `https://aicxenaipzrzbfytdmpe.supabase.co` |
| Supabase Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpY3hlbmFpcHpyemJmeXRkbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMDU4NzQsImV4cCI6MjA5NTY4MTg3NH0.Qb8-3d5wZ2fU4UbVvtnz5IWaQrL2xHtCJyndgFDOTYs` |
| Google Maps API Key | `AIzaSyAB1ztDhvX4Ta5YT1wl6mSUBQca4SvwY4Q` |
| GitHub Repo | `https://github.com/mjp-space/nasaanako-ph` |
| Vercel Project | `nasaanako-ph` (mj-space-s-projects team) |
| Vercel Dashboard | `https://vercel.com/mj-space-s-projects/nasaanako-ph` |
| Domain Registrar | dot.ph |
| Live URL | `https://www.nasaanako.ph` |
| Supabase Dashboard | `https://supabase.com/dashboard/project/aicxenaipzrzbfytdmpe` |
| Google Cloud Console | `https://console.cloud.google.com` → find the Maps API key project |

### Google Maps API Key — HTTP Referrer Allowlist
- `*.nasaanako.ph/*`
- `nasaanako.ph/*`
- `nasaanako-ph.vercel.app/*`
- `http://localhost:3000/*`
- `http://localhost:3000`
- `localhost/*`

**APIs enabled:** Maps JavaScript API, Street View API

---

## Database Tables (Supabase)

| Table | Purpose |
|-------|---------|
| `profiles` | One row per user. Stores username, display_name, total_score, best_score, games_played, tier |
| `games` | One row per game (saved after every round). Stores score, rounds_played, accuracy, avg_distance_km, mode, played_at |
| `visitors` | Unique visitor tracking via localStorage fingerprint (id, first_seen, last_seen) |
| `leaderboard` | VIEW — ranks profiles by total_score descending, includes games_played |

All tables have RLS enabled. `visitors` allows public upsert.

---

## Current Live Status (End of May 30, 2026)

| Item | Status |
|------|--------|
| Production URL | ✅ https://www.nasaanako.ph |
| Vercel auto-deploy | ✅ Triggers on every `git push` to `main` |
| Google Maps + Street View | ✅ Working |
| Supabase auth | ✅ Sign up / log in / guest play |
| Score saving | ✅ Saves after EVERY round (partial games captured) |
| Leaderboard | ✅ Homepage top 10 + in-game top 3 widget + scrolling ticker |
| Mobile layout | ✅ iPhone 14+ responsive, 100dvh for Safari |
| og:image | ✅ Server-rendered via `/app/og/route.tsx` using `next/og` |
| Visitor counter | ✅ localStorage fingerprint → `visitors` Supabase table |
| Loading screen | ✅ Spinner + help text + Refresh button while Street View loads |
| Timer | ✅ 60 seconds, hidden during loading, auto-refresh if still black at 0 |

---

## Session Log — May 30, 2026 (Full Day)

### What Was Built From Scratch
- Converted static HTML prototype → full Next.js 16 app with TypeScript + Tailwind
- Pages: `/` landing, `/modes` mode picker, `/play` game, `/auth` auth
- Supabase: profiles, games, visitors tables + leaderboard view with RLS
- Google Maps JS API + Street View — script injection with double-load guard
- 302 PH locations across all regions in `lib/locations.js`
- Scoring: Haversine distance, 0–5000 pts per round, tier system
- Sound effects: background music, pin drop, good/bad/perfect score, round start

### All Bugs Fixed

| Bug | Fix |
|-----|-----|
| `RefererNotAllowedMapError` | Added localhost:3000 to Google Cloud API key allowlist |
| Maps loads twice on navigation | Guard: check `document.querySelector('script[src*="maps.googleapis.com"]')` |
| Black map on mobile | 300ms init delay + `resize` event trigger after flex container paints |
| Street View black screen (main issue) | `StreetViewService.getPanorama()` 1km pre-check + loading spinner + 8s timeout auto-skip + Refresh button + preload on app open + preload during result screen |
| Score shows 0 in header for logged-in users | Header shows profile `total_score` from Supabase, not session score |
| Leaderboard shows 0-score players | Filter with `.gt('total_score', 0)` |
| `useSearchParams` Vercel build error | Wrapped in `<Suspense>` in auth/page.tsx |
| Vercel 404 after first deploy | Framework Preset was blank ("Other") — set to Next.js |
| Git push failed (no remote) | Added remote origin + force pushed over old HTML prototype |
| Auth form autofilled owner's name | `autoComplete="off"` + placeholder changed to Juan Dela Cruz / juandelacruz123 |
| Nav buttons overlapping on mobile | `whiteSpace: nowrap` + tighter padding |
| Guess map showed whole world | `restriction: { latLngBounds: phBounds }` + `fitBounds()` on init |
| Two-finger map gesture on mobile | `gestureHandling: 'greedy'` |
| Score only saved at round 5 | Now saves after every round — partial games captured |
| og:image showed garbled text | Replaced ImageMagick PNG with server-rendered `next/og` route at `/app/og/route.tsx` |
| Leaderboard widget always expanded | `useState(false)` — collapsed by default, toggle with 🏆 button |
| Game UI visible during loading | All game elements hidden when `svLoading === true` |
| Timer still ran during loading | Timer hidden until `svLoading === false` |

### Features Added Post-Launch
- Mobile-responsive layout (iPhone 14+, 100dvh)
- Loading screen: spinner + "Finding your drop location…" + Refresh button
- Auto-refresh location if Street View doesn't load within 60s timer
- Preload next Street View location during result screen (2 candidates)
- Preload on app open immediately when Maps API loads
- Score saved after every round (not just game over)
- Inline sign-up/login on final screen (no navigation away, score preserved)
- Visitor counter via localStorage fingerprint → Supabase `visitors` table
- og:image via Next.js `ImageResponse` (server-rendered, fonts work properly)
- Per-round leaderboard widget refresh after score saves
- Timer increased 30s → 60s
- Guess map restricted to Philippines bounds + `fitBounds()` on load
- `getDailyLocations()` seeded function ready but not activated

### Player Base at End of Session
- **5 signed-up players**
- **Spacemonkey** — 23,105 pts, 8 games (owner)
- **Alipores Ni Mayor** — 4,687 pts, 2 games
- **AntonyetaKa, Laura, Tubogcha** — 0 pts (signed up, couldn't play due to black screen)

---

## Session Log — June 1, 2026

### Features Added
- **Map expand/collapse toggle** — 4-corner SVG arrow button in bottom-right of minimap. Expands map to 55vh, guess button and timesup overlay slide up with it. Map fires `resize` event after animation so Google Maps redraws correctly. Toggle state: `mapExpanded` in `play/page.tsx`.
- **Temp pinned locations (Imus, Cavite)** — 3 specific addresses always load in the first 3 rounds for testing. Defined in `TEMP_PINNED_LOCATIONS` array at the top of `lib/locations.js`. To remove: delete the `TEMP_PINNED_LOCATIONS` block in `locations.js` and the import + usage in `play/page.tsx` (both clearly marked with `// TEMP` comments).
  - 17 Avenida Rizal, Imus, Cavite (`14.3952544, 120.9587179`)
  - Topacio St, Imus, Cavite (`14.3952650, 120.9595260`)
  - 192 Diokno St cor Topacio, Imus, Cavite (`14.3953848, 120.9598414`)

### Planned Mode — "Loop" (concept, not built yet)
- Player starts near their real GPS location (browser Geolocation API)
- Follows the Pan-Philippine Highway spine: Luzon → ferry → Visayas → ferry → Mindanao
- Checkpoints every 1km save progress to Supabase
- After mainland complete, map shows remaining islands to island-hop
- Needs: curated route GeoJSON, checkpoint schema in Supabase, Street View coverage pre-validation

---

## Pending for Next Session

| Priority | Task |
|----------|------|
| 🔴 High | Remove `TEMP_PINNED_LOCATIONS` from `lib/locations.js` when Imus testing is done |
| 🟡 Medium | Activate Daily Challenge mode (`getDailyLocations()` is ready in locations.js) |
| 🟡 Medium | Add Share Score button on final screen (generates shareable image for social) |
| 🟡 Medium | Add more game modes (Pamana, Kalikasan, Sikat — UI exists, just needs activation) |
| 🟡 Medium | Add forgot password flow |
| 🟡 Medium | Build "Loop" mode — Pan-Philippine Highway journey with checkpoint saves |
| 🟢 Low | Upgrade `google.maps.Marker` → `AdvancedMarkerElement` (deprecated, not urgent) |
| 🟢 Low | Enable Vercel Analytics (free — just click Enable in Vercel dashboard) |
| 🟢 Low | Add email-based auth option (currently username-only) |

---

## How to Resume Development

```bash
# 1. Start local dev server
cd ~/Documents/Claude/Projects/nasaanako-nextjs
npm run dev
# Open localhost:3000

# 2. Make changes, then deploy
git add .
git commit -m "your message"
git push
# Vercel auto-deploys in ~2 minutes

# 3. Check live users/scores via Claude + Supabase MCP
# Connect Supabase MCP in Claude, then ask:
# "Show me all players and their scores"
```

**First message to Claude when resuming:**
> "We're building NasaanAko.ph — a GeoGuessr-style Philippines geography game. Stack: Next.js 16, Supabase, Vercel, Google Maps API. Live at nasaanako.ph. Read TECHNICAL.md in the nasaanako-nextjs project folder for full context including all keys, current status, and what's pending."

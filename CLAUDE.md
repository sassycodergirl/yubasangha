# Project Context

## Overview
A website built entirely in **Next.js** (App Router) — single codebase for both
the public-facing site and the admin panel. The admin panel IS the CMS: there
is no separate CMS product, admins log in and manage all content that the
public site displays.

## Build Phases
1. **Phase 1 — Static frontend first.** Build all public pages with static/
   placeholder content, get layout, design, and routing right before touching
   the database or CMS.
2. **Phase 2 — Make it dynamic via the CMS.** Build the admin panel (`/admin`)
   with CRUD screens for each content type, connect the public pages to pull
   real content from the database instead of static placeholders.
3. **Phase 3 (optional, later)** — features like live streaming (via embedded
   YouTube Live / Cloudflare Stream, not self-hosted), on-demand ISR
   revalidation, additional content types as needed.

Do not skip ahead to Phase 2 work while Phase 1 is incomplete unless explicitly
asked.

## Tech Stack
- **Framework:** Next.js 16 (App Router), plain JavaScript (`.js`/`.jsx`, not
  TypeScript). Note: Next 16 has breaking changes vs. older versions — check
  `node_modules/next/dist/docs/` before writing routing/data-fetching code.
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"` in `globals.css`)
- **Database:** PostgreSQL via Neon or Supabase (free tier) — used from local
  dev too, not a locally-installed Postgres instance
- **ORM:** Prisma
- **Auth (admin login only):** NextAuth.js
- **Rich text editor (CMS content):** Tiptap
- **Media/image uploads:** Cloudinary or UploadThing (no persistent filesystem
  on Vercel — never write uploads to local disk in production code)
- **Backend:** Next.js API Routes / Route Handlers — no separate Express/
  Laravel backend. Do not introduce a second backend service unless a feature
  genuinely requires it (e.g. WebSockets, long-running jobs).
- **Hosting:** Vercel (frontend + backend + admin, all one deploy)
- **Rendering strategy:** Prefer React Server Components by default. Use
  Client Components (`"use client"`) only where real interactivity is needed
  (forms, admin tables, buttons). Public content pages should use ISR with
  on-demand revalidation triggered when an admin saves/publishes content —
  not full SSR-on-every-request unless there's a reason.

## Folder Structure (actual)
Everything lives under `src/`. Import alias: `@/*` → `src/*`.
```
src/
  app/
    layout.js           → root <html>/<body> + fonts + base metadata only
    (public)/            → public-facing site
      layout.js          → Header + Footer chrome
      page.js            → home
      about-us/ contact/ events/ gallery/ live-darshan/
      map/ schedule/ theme-2026/
    admin/               → CMS admin panel (own layout, noindex; auth in Phase 2)
      layout.js  page.js
    api/                 → route handlers
      revalidate/route.js → on-demand ISR hook (stub until Phase 2)
  components/
    layout/              → Header, Footer, DonateModal
    home/                → homepage sections (Hero, About, Theme, …) + their
                            section-specific pieces (AboutTimeline, ThemeGallery)
    ui/                  → shared primitives (GoldButton, GhostButton,
                            SectionBackground, icons, …)
    admin/               → admin-only components
  lib/                   → per-section content configs (site.js, about.js,
                            theme.js, …) + shared utilities; db.js, auth.js in
                            Phase 2
prisma/
  schema.prisma          → database schema (Phase 2)
```

## Content Types (CMS Resources)
Fill in as they're finalized. Starting candidates based on project discussion:
- **Pages** — title, slug, content blocks, SEO meta
- **Events** — name, date, description, banner image, optional live stream
  link/embed
- **Media** — uploaded images/assets used across the site
- **Settings** — site-wide values (logo, contact info, social links)

## Conventions & Rules
- One language throughout: JavaScript only — no PHP, no separate backend
  language. Components in `.jsx`, everything else `.js`.
- **Homepage sections are built like Hero/About/Theme**: each section's copy
  and content (headings, stats, gallery/timeline items, CTAs, background
  image path) live in their own `src/lib/<section>.js` config object, and
  the section component just renders that data — no hardcoded strings in the
  component. Phase 1 imports these statically; Phase 2 swaps the *source*
  of that same shape (DB fetch instead of a static import) without the
  section components needing to change. Every section's content is
  admin-editable in Phase 2 unless noted otherwise in its `lib/*.js` file.
- **Section backgrounds**: every section renders via `SectionBackground`
  (`src/components/ui/SectionBackground.jsx`) — pass it that section's
  `backgroundImage` field. If it's set, the real photo shows (with a dark
  scrim for legibility); if it's `null` (no photo uploaded yet), it falls
  back to the site's ambient gradient by default. Do not hand-roll this per
  section. Exception: **About** passes `fallback="none"` and stays plain
  `bg-ink` until it has a real photo — a deliberate per-section choice, not
  the default; new sections should keep the gradient fallback unless there's
  a similar reason not to.
- **Section-to-section blending**: right after `SectionBackground`, every
  section also renders `SectionBlend` (`src/components/ui/SectionBlend.jsx`)
  — a soft fade from the shared `ink` tone across its top edge. This is what
  keeps the seam between two stacked sections looking like a blend instead
  of a hard cut, while the rest of the section is still free to use its own
  gradient/vignette/hue further down. Add it to every new section.
- Primary CTAs use `GoldButton` (filled maroon + gold splash), secondary/
  outline CTAs use `GhostButton` (gold outline, no fill) — both in
  `src/components/ui/`. Add new button *variants* there, don't restyle a
  one-off `<Link>`/`<button>` inline in a section.
- Secrets live only in `.env` (never committed) locally, and in Vercel's
  Environment Variables dashboard in production. Never hardcode API keys.
- Any environment variable prefixed `NEXT_PUBLIC_` is exposed to the browser
  — never put secrets there.
- Validate all input on API routes, not just in the frontend form.
- Keep the API response shape consistent across endpoints — don't let the
  frontend's expected shape drift from what an API route actually returns.
- Prefer Server Components; justify any new Client Component.
- Database schema changes go through Prisma migrations, not manual SQL.
- Write code that a solo, non-expert maintainer (the project owner) can
  reasonably read and modify later — avoid unnecessary cleverness/abstraction.

## Deployment Workflow
1. Develop and test locally (`npm run dev`) against the real Neon/Supabase
   dev database.
2. Push to GitHub (`.env` and `node_modules` gitignored).
3. Vercel auto-deploys on push to `main`; PRs/branches get preview
   deployments — test there before merging to production.
4. Environment variables are set once in the Vercel dashboard, matching local
   `.env` keys.

## Explicitly Out of Scope (for now)
- No Laravel, no PHP, no cPanel hosting.
- No self-hosted database or self-hosted video streaming server.
- No separate Express/Node server unless a specific future feature requires
  it (document the reason here if that changes).
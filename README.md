# Yuba Sangha

Website for Telipukur Yuba Sangha & Nursery Bagan Adivasi Brinda's Durga Puja — public site and admin CMS in one Next.js app.

## Tech stack

- **Next.js 16** (App Router), plain JavaScript
- **Tailwind CSS v4**
- **PostgreSQL** (Supabase), via **Prisma** with a driver adapter
- **NextAuth.js** for the single-admin login
- Media uploads via **Supabase Storage**

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your own values
npx prisma db seed           # creates the admin login + initial content
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

## Project structure

See `CLAUDE.md` for the full architecture — folder layout, content model, and conventions this codebase follows.

## Deployment

Deploys to Vercel on push to `main`. Environment variables (matching `.env.example`) are set in the Vercel dashboard, not committed.

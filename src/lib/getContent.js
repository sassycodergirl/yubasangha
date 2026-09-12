import { db } from "@/lib/db";
import { findSection } from "@/lib/admin/sections";

// Server-only: fetches one admin-editable content block by slug, falling
// back to its Phase 1 seed if no row exists yet (matches the admin edit
// pages' own fallback). Public pages call this instead of importing the
// static src/lib/<section>.js config directly.
//
// No caching yet -- every call hits the DB. Fine for this site's traffic;
// swap in ISR/on-demand revalidation (CLAUDE.md's stated plan, via
// /api/revalidate) once that's wired up, not before.
export async function getContent(slug) {
  const section = findSection(slug);
  if (!section) {
    throw new Error(`getContent: unknown slug "${slug}"`);
  }

  const row = await db.content.findUnique({
    where: { type_slug: { type: section.type, slug } },
  });

  return row?.data ?? section.seed;
}

// "Our Sponsors" homepage section content (Phase 1 static/seed shape). The
// "Upcoming Events" teaser next to it is presentation-only now (see the
// "events" entry in src/lib/admin/sections.js) -- the event it shows comes
// live from the Events collection (src/lib/events.js), not from here, so an
// admin never has to enter the same event twice.
//
// NOTE: placeholder content only. Deliberately not reproducing a real
// company's logo under "sponsors" -- not confirmed, and putting one on the
// live site would misrepresent a sponsorship that may not exist. Swap in the
// actual confirmed sponsor names + logos once finalized.
//
// Full layout control, for the /sponsors page's showcase (src/components/
// sponsors/SponsorsShowcase.jsx) -- the homepage's own sponsor display is a
// fixed-size auto-scrolling carousel (src/components/home/Sponsors.jsx)
// where per-logo sizing doesn't apply the same way, so this only affects
// the full page. Grouped under its own `layoutSettings` object (instead of
// sitting as loose top-level fields next to unrelated ones like
// `viewAllHref`) so the admin form renders it as one clearly-labeled "Grid
// Layout" card instead of several scattered, seemingly-unrelated fields:
//   - `layout`/`columns`/`align`: the section-wide defaults -- "flex" (a
//     tier's cards wrap and center at their own size) or "grid" (locked to
//     an even N-column grid, `columns` wide), and which way a short row
//     leans (`align`).
//   - `tierLayouts`: per-tier overrides of those same three fields, keyed
//     by `tier` (must match a sponsor's `tier` text exactly, case/space-
//     insensitive). A tier with no entry here just uses the section-wide
//     defaults above -- this only needs an entry for a tier that wants
//     something different (e.g. Gold in a tight 4-column grid, Radio
//     Partner wrapped loosely in 6).
//
// Each sponsor's own `width`/`height` (px) is separate from all of this --
// each logo's own card size, so a sponsor with an unusually wide or tall
// logo doesn't get cropped or swallowed by a one-size-fits-all box.
export const sponsorsContent = {
  eyebrow: "Our Sponsors",
  viewAllHref: "/contact",
  layoutSettings: {
    layout: "flex",
    columns: 4,
    align: "center",
    tierLayouts: [{ tier: "Gold", layout: "grid", columns: 4, align: "center" }],
  },
  sponsors: [
    { id: "s1", tier: "Diamond", name: "Sponsor Name", logo: "/sponsors/placeholder-1.svg", width: 224, height: 112 },
    { id: "s2", tier: "Platinum", name: "Sponsor Name", logo: "/sponsors/placeholder-2.svg", width: 192, height: 96 },
    { id: "s3", tier: "Gold", name: "Sponsor Name", logo: "/sponsors/placeholder-3.svg", width: 160, height: 80 },
    { id: "s4", tier: "Silver", name: "Sponsor Name", logo: "/sponsors/placeholder-4.svg", width: 128, height: 64 },
    { id: "s5", tier: "Gold", name: "Sponsor Name", logo: "/sponsors/placeholder-5.svg", width: 160, height: 80 },
    { id: "s6", tier: "Silver", name: "Sponsor Name", logo: "/sponsors/placeholder-6.svg", width: 128, height: 64 },
  ],
};

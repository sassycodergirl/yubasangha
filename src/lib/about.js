// "About Us" homepage section content (Phase 1 static).
// Phase 2: `timeline` becomes an admin-managed collection (its own CMS
// resource) -- admins add/reorder/edit milestones (year, title, description,
// image) from /admin; `stats`/`values`/`description` fold into "Settings" or
// a "Pages" block. Component props (see AboutTimeline) won't need to change.

export const aboutContent = {
  subtitle: "Our Legacy",
  // Two-line heading, same convention as PandalMap's `title` array -- was
  // previously composed from the site-wide branding name/secondary name,
  // now its own section-specific editable field.
  title: ["About Telipukur Yuba Sangha", "& Nursery Bagan Adivasi Brinda"],
  description:
    "For decades, our puja has been more than a celebration — it is a promise kept, a culture preserved, and a bond strengthened with every heartbeat of this community.",
  stats: [
    { value: "70+", label: "Yrs of Legacy" },
    { value: "500+", label: "Volunteers" },
    { value: "100K+", label: "Visiting Every Year" },
    { value: "50+", label: "Awards Won" },
  ],
  cta: { label: "Our Journey", href: "/about-us" },
  timeline: [
    {
      year: "1954",
      title: "The journey begins.",
      description: "A small initiative with a big dream.",
      image: "/about/milestone-1954.svg",
    },
    {
      year: "1980",
      title: "Growing stronger.",
      description: "More hands, one purpose.",
      image: "/about/milestone-1980.svg",
    },
    {
      year: "2026",
      title: "Continuing the legacy.",
      description: "Honoring tradition, embracing the future.",
      image: "/about/milestone-2026.svg",
    },
  ],
  values: ["Unity", "Devotion", "Culture", "Service"],
  // Used only when this section renders with `showTimeline={false}` (the
  // About Us page) in place of the milestone timeline -- a small two-photo
  // collage instead. Left null, each slot shows a placeholder.
  collageImages: [null, null],
  // No section background photo yet -- set to a path under /public (or an
  // uploaded asset URL) to show one. Left null, the section just renders
  // its plain background.
  backgroundImage: null,
};

// Registry of CMS-managed pages. Each entry is one public page; adding a new
// page later is one more entry here plus that page's sections registered in
// src/lib/admin/sections.js with a matching slug in their `pages` array.
export const pages = [
  { slug: "home", label: "Homepage", description: "The public homepage — sections shown in this order." },
  { slug: "about-us", label: "About Us", description: "The /about-us page." },
  { slug: "theme-2026", label: "Theme 2026", description: "The /theme-2026 page." },
  { slug: "schedule", label: "Schedule Page", description: "The /schedule page." },
  { slug: "gallery", label: "Gallery", description: "The /gallery page." },
  { slug: "live-darshan", label: "Live Darshan", description: "The /live-darshan page." },
  { slug: "map", label: "Map Page", description: "The /map page." },
  { slug: "sponsors", label: "Sponsors Page", description: "The /sponsors page." },
  { slug: "contact", label: "Contact", description: "The /contact page." },
  {
    slug: "events",
    label: "Events",
    description: "The /events page banner. The event listing itself is managed from Events in the sidebar.",
  },
];

export function findPage(slug) {
  return pages.find((page) => page.slug === slug);
}

export function pageLabel(slug) {
  return findPage(slug)?.label ?? slug;
}

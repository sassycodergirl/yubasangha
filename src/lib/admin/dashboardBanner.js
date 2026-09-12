// The admin's own dashboard banner -- not public content (it's not part of
// src/lib/admin/sections.js and never shown on the public site), just a mood
// setter the admin sees when they log in. Stored the same generic way
// (Content row, type+slug+data) so it reuses the existing API route + form.
export const dashboardBanner = {
  slug: "dashboard-banner",
  type: "admin_ui",
  label: "Dashboard Banner",
  seed: {
    image: "/hero-banner.webp",
    caption: "Maa Durga's blessings guide this year's celebration.",
  },
};

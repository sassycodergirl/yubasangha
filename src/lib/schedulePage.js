// "Puja Schedule" page content -- seed values for the "schedule-banner" and
// "schedule-timeline" admin blocks. The ritual list itself is shared with
// the homepage's own "schedule" section, see src/lib/scheduleEvents.js.

export const schedulePageBanner = {
  title: "Puja Schedule",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Schedule", href: "/schedule" },
  ],
  // No banner photo yet -- falls back to the site's ambient gradient (see
  // SectionBackground) until an admin uploads one.
  backgroundImage: null,
};

export const scheduleTimelineContent = {
  subtitle: "Day of Devotion",
  title: ["A Day Woven", "in Ritual & Rhythm"],
  description:
    "From the first Mangal Aroti at dawn to the immersion procession at night, every hour of Ashtami carries its own ritual and its own energy. Here's how the day unfolds.",
};

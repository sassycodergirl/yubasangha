// Shared "Puja Schedule" content -- one block, edited once from either the
// Homepage's Puja Schedule section or the Schedule page's own admin screen
// (see the "schedule-events" entry in src/lib/admin/sections.js; it also
// gets its own top-level "Puja Schedule" admin nav item, same as Events --
// see src/app/admin/schedule/page.js). Both pages render the exact same
// day-card grid (src/components/home/PujaSchedule.jsx, reused directly on
// /schedule the same way Theme.jsx is reused on /theme-2026), so an admin
// only ever enters this once.
//
// Day-grouped, not a flat ritual list: each entry is one day of the
// festival (title + an ISO `date`, used to derive the day number/month/
// weekday badge -- see getDateLabel in src/lib/dateFormat.js). Two entries
// can share the same `date` (e.g. "Maha Ashtami" and "Sandhi Puja" both fall
// on Ashtami) when a day has a named sub-ritual worth its own card.
//
// `items` is free text, not a fixed {label, time} shape -- an admin just
// types a line per ritual (PujaSchedule.jsx's ItemText bolds a leading
// "name — time" automatically if written that way, but any plain line
// works too) instead of being boxed into separate label/time fields for
// every single entry.
export const scheduleEventsContent = {
  days: [
    {
      title: "Maha Shashthi",
      date: "2026-09-22",
      items: ["Bodhon — 7:00 AM", "Amontron & Adhibas — 7:00 PM"],
    },
    {
      title: "Maha Saptami",
      date: "2026-09-23",
      items: [
        "Nabopatrika Snan — 6:30 AM",
        "Mahasaptami Puja — 9:30 AM",
        "Saptami Anjali — 11:00 AM",
        "Sandhya Arti — 6:30 PM",
      ],
    },
    {
      title: "Maha Ashtami",
      date: "2026-09-24",
      items: [
        "Puja Starts — 5:00 AM",
        "Ashtami Anjali — 10:00 AM",
        "Sandhi Puja Begins — 7:26 PM",
        "Sandhya Arti — 6:30 PM",
      ],
    },
    {
      title: "Sandhi Puja",
      date: "2026-09-24",
      items: ["108 Deep Daan — 7:50 PM", "Sandhi Puja Ends — 8:14 PM"],
    },
    {
      title: "Maha Navami",
      date: "2026-09-25",
      items: [
        "Puja Starts — 6:00 AM",
        "Navami Anjali — 8:00 AM",
        "Homa & Bali — 8:45 AM",
        "Sandhya Arti — 6:30 PM",
      ],
    },
    {
      title: "Bijoya Dashami",
      date: "2026-09-26",
      items: [
        "Puja Starts — 7:00 AM",
        "Aparajita Puja — 9:30 AM",
        "Sindoor Khela — 10:30 AM",
        "Immersion Procession — 4:00 PM",
      ],
    },
  ],
};

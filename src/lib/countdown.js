// "Festival Countdown" homepage section content (Phase 1 static). Phase 2:
// `occasions` becomes an admin-managed collection -- the puja calendar
// changes every year, so admins update dates/labels from /admin without a
// code change. Component (FestivalCountdown) won't need to change.
//
// NOTE: dates below are a placeholder 2026 calendar (Mahalaya + the five
// Shashthi-Dashami days spaced the way they typically fall) -- confirm
// against the actual published panchang/committee calendar and update
// before launch.

export const festivalCountdown = {
  eyebrow: "Festival Countdown",
  backgroundImage: null,
  occasions: [
    { label: "Mahalaya", date: "2026-09-17", dateLabel: "17 Sept", featured: true },
    { label: "Shashthi", date: "2026-09-22", dateLabel: "22 Sept" },
    { label: "Saptami", date: "2026-09-23", dateLabel: "23 Sept" },
    { label: "Ashtami", date: "2026-09-24", dateLabel: "24 Sept" },
    { label: "Navami", date: "2026-09-25", dateLabel: "25 Sept" },
    { label: "Dashami", date: "2026-09-26", dateLabel: "26 Sept" },
  ],
};

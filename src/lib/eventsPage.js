// "Events" page banner content (Phase 1 static, now the seed for the
// "events-banner" admin block -- see src/lib/admin/sections.js). The event
// listing itself is a proper admin-managed collection (src/lib/events.js,
// admin UI at /admin/events), not static content -- each event is its own
// row, editable/creatable/deletable from there, and the homepage's featured
// teaser reads from that same collection instead of duplicating an event.

export const eventsPageBanner = {
  title: "Events",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
  ],
  // No banner photo yet -- falls back to the site's ambient gradient (see
  // SectionBackground) until an admin uploads one.
  backgroundImage: null,
};

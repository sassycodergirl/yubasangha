import { db } from "@/lib/db";

// The Events collection: each event is its own Content row (type "event"),
// ordered by the admin-controlled `order` field. Distinct from the
// homepage's "events" section (src/lib/admin/sections.js), which only holds
// that teaser's own presentation fields (eyebrow, viewAllHref, background) --
// the event the teaser shows is whichever one here has `data.featured: true`
// (picked explicitly by the admin, see EventsListClient.jsx), so an admin
// only ever enters an event's details once.
function rowToEvent(row) {
  return { id: row.id, ...row.data };
}

// Admin-only: every event regardless of publish state, for the admin list.
export async function listEventRows() {
  return db.content.findMany({
    where: { type: "event" },
    orderBy: { order: "asc" },
  });
}

// Public: published events, shaped for the page components.
export async function getPublishedEvents() {
  const rows = await db.content.findMany({
    where: { type: "event", published: true },
    orderBy: { order: "asc" },
  });
  return rows.map(rowToEvent);
}

// Public: the one event the homepage teaser shows -- whichever published
// event is marked `featured`, or the top of the admin's ordered list if none
// has been picked yet (e.g. a fresh install), or null if there are no
// published events at all.
export async function getFeaturedEvent() {
  const events = await getPublishedEvents();
  return events.find((event) => event.featured) ?? events[0] ?? null;
}

// Marks one event as the homepage teaser's featured event and unmarks every
// other one, so exactly one (or zero, before an admin has ever picked) is
// ever featured at a time. Reads the current data for every OTHER event
// needing to change so their other fields aren't clobbered (Content.data is
// a whole-JSON-blob column, not a partial-update jsonb one), then applies
// all the unfeaturing writes as a single transaction.
export async function setFeaturedEvent(id) {
  const others = await db.content.findMany({
    where: { type: "event", id: { not: id } },
  });
  const unfeature = others
    .filter((event) => event.data?.featured)
    .map((event) =>
      db.content.update({
        where: { id: event.id },
        data: { data: { ...event.data, featured: false } },
      })
    );
  if (unfeature.length > 0) await db.$transaction(unfeature);
}

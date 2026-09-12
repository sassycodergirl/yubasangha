import { db } from "@/lib/db";

// The Live Darshan video collection: each video is its own Content row
// (type "live-video"), ordered by the admin-controlled `order` field. The
// homepage only ever shows the one marked `featured` (see
// getFeaturedLiveVideo) -- the Live Darshan page shows that same one front
// and center, plus every other published video underneath it to switch to
// (see LiveDarshanShowcase.jsx). Same collection pattern as Events, see
// src/lib/events.js.
function rowToVideo(row) {
  return { id: row.id, ...row.data };
}

// Admin-only: every video regardless of publish state, for the admin list.
export async function listLiveVideoRows() {
  return db.content.findMany({
    where: { type: "live-video" },
    orderBy: { order: "asc" },
  });
}

// Public: published videos, shaped for the page components.
export async function getPublishedLiveVideos() {
  const rows = await db.content.findMany({
    where: { type: "live-video", published: true },
    orderBy: { order: "asc" },
  });
  return rows.map(rowToVideo);
}

// Public: the one video the homepage shows -- whichever published video is
// marked `featured`, or the top of the admin's ordered list if none has
// been picked yet, or null if there are no published videos at all.
export async function getFeaturedLiveVideo() {
  const videos = await getPublishedLiveVideos();
  return videos.find((video) => video.featured) ?? videos[0] ?? null;
}

// Marks one video as featured and unmarks every other one -- see
// setFeaturedEvent in src/lib/events.js for the equivalent on Events; same
// reasoning (Content.data is a whole-JSON-blob column, not partial-update
// jsonb, so every other featured row needs its full data read back and
// rewritten, not just the one flag).
export async function setFeaturedLiveVideo(id) {
  const others = await db.content.findMany({
    where: { type: "live-video", id: { not: id } },
  });
  const unfeature = others
    .filter((video) => video.data?.featured)
    .map((video) =>
      db.content.update({
        where: { id: video.id },
        data: { data: { ...video.data, featured: false } },
      })
    );
  if (unfeature.length > 0) await db.$transaction(unfeature);
}

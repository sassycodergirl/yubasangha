// "Live Darshan" section content -- presentation only (eyebrow, tagline,
// CTA, devotee-count label, fullscreen label, background). Shared between
// the homepage and the Live Darshan page (same wording in both places).
// The actual video(s) are a proper admin-managed collection now -- see
// src/lib/liveVideos.js and /admin/live-darshan -- so an admin enters a
// video's title/ID once, in one list, however many there are.
//
// Phase 2 TODO still open: the devotee count becomes a real number polled
// from a server route that calls the YouTube Data API v3
// (videos.list?part=liveStreamingDetails -> concurrentViewers) instead of
// the client-side simulated counter used for now (see useLiveCounter in
// LiveDarshan.jsx).

export const liveDarshanContent = {
  eyebrow: "Live Darshan",
  tagline: "Seek blessings from Maa, no matter where you are.",
  cta: { label: "Watch Live", href: "#live-video" },
  devoteesLabel: "Devotees Online",
  fullscreenLabel: "Open in Fullscreen",
  backgroundImage: null,
};

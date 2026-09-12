// "Gallery" homepage section content (Phase 1 static). Phase 2: `images`
// becomes an admin-managed collection -- upload, tag with one or more
// `categories` (from the fixed `filters` list below, picked from a
// dropdown/checkboxes, not free text). `ratio` (width / height) drives the
// justified-row layout in Gallery.jsx; in Phase 2 this can be read straight
// off the uploaded file's real dimensions instead of being set by hand.

export const galleryContent = {
  eyebrow: "Gallery",
  filters: [
    { id: "all", label: "All" },
    { id: "pandal", label: "Pandal" },
    { id: "idol", label: "Idol" },
    { id: "culture", label: "Culture" },
    { id: "drone", label: "Drone Shots" },
    { id: "videos", label: "Videos" },
  ],
  images: [
    {
      id: "g1",
      src: "/gallery/g1-idol-closeup.svg",
      alt: "Close-up of the Durga idol",
      categories: ["idol"],
      ratio: 0.72,
    },
    {
      id: "g2",
      src: "/gallery/g2-pandal-arch.svg",
      alt: "Pandal entrance archway",
      categories: ["pandal"],
      ratio: 1.25,
    },
    {
      id: "g3",
      src: "/gallery/g3-pandal-night.svg",
      alt: "Illuminated pandal at night",
      categories: ["pandal", "culture"],
      ratio: 1.7,
    },
    {
      id: "g4",
      src: "/gallery/g4-idol-detail.svg",
      alt: "Idol ornamentation detail",
      categories: ["idol"],
      ratio: 1.25,
    },
    {
      id: "g5",
      src: "/gallery/g5-fireworks.svg",
      alt: "Fireworks over the pandal",
      categories: ["culture"],
      ratio: 1.25,
    },
    {
      id: "g6",
      src: "/gallery/g6-culture-stage.svg",
      alt: "Cultural evening performance",
      categories: ["culture"],
      ratio: 1.25,
    },
    {
      id: "g7",
      src: "/gallery/g7-drone-aerial.svg",
      alt: "Aerial drone view of the pandal",
      categories: ["drone"],
      ratio: 0.72,
    },
    {
      id: "g8",
      src: "/gallery/g8-interior-corridor.svg",
      alt: "Pandal interior corridor",
      categories: ["pandal"],
      ratio: 0.72,
    },
  ],
  viewAll: { label: "View All Gallery", href: "/gallery" },
};

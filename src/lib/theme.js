// "Theme 2026" homepage section content (Phase 1 static; a separate section,
// placed right after About on the homepage). Phase 2: `gallery` becomes an
// admin-managed collection -- add/reorder/edit items (label, image) from
// /admin -- the rest folds into "Pages"/"Settings". Component props (see
// ThemeGallery) won't need to change.

export const themeContent = {
  eyebrow: "Theme 2026",
  title: "Shashwat",
  subtitle: "(Sanatan)",
  taglineLines: ["Eternal Roots.", "Timeless Spirit."],
  cta: { label: "Discover the Story", href: "/theme-2026" },
  gallery: [
    { label: "Concept Art", image: "/theme/concept-art.svg" },
    { label: "Mood Board", image: "/theme/mood-board.svg" },
    { label: "3D Render", image: "/theme/render.svg" },
    { label: "Artist Sketch", image: "/theme/artist-sketch.svg" },
    { label: "Behind the Scenes", image: "/theme/behind-scenes.svg" },
  ],
  backgroundImage: null,
};

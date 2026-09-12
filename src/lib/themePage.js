// "Theme 2026" page content -- seed values for the "theme-banner",
// "theme-story" and "theme-artist" admin blocks (see
// src/lib/admin/sections.js). The homepage's own "theme" section
// (src/lib/theme.js) is reused as-is further down this page, gallery and all.

export const themePageBanner = {
  title: "Theme 2026",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Theme 2026", href: "/theme-2026" },
  ],
  // No banner photo yet -- falls back to the site's ambient gradient (see
  // SectionBackground) until an admin uploads one.
  backgroundImage: null,
};

export const themeStoryContent = {
  subtitle: "This Year's Theme",
  title: ["Shashwat", "(Sanatan)"],
  description: [
    "Every year, our pandal tells a story — this year, it's one of roots that never let go. \"Shashwat\" is a meditation on what stays constant even as everything around it changes: faith passed from one generation to the next, rituals that outlive the hands that first performed them.",
    "The design draws from centuries-old temple motifs and folk craft traditions, reimagined at pandal scale — a tribute to the artisans and storytellers who kept these forms alive long before they became inspiration for a festival.",
  ],
  // No photo uploaded yet -- ThemeStory shows a decorative placeholder
  // instead of a broken image until this is set. Alt text isn't an
  // admin-editable field -- ThemeStory.jsx hardcodes it.
  image: null,
};

export const themeArtistContent = {
  subtitle: "The Artist",
  name: "Bhabatosh Sutar",
  role: "Concept & Set Design",
  quote: "A pandal should feel like memory you can walk into.",
  bio: "Bhabatosh has led the creative direction of our puja for the past three editions, drawing on a background in set design and traditional Bengali craft. This year's theme grew out of conversations with the artisans who still practice the techniques it's built around.",
  // No photo uploaded yet -- ArtistSpotlight shows a decorative placeholder
  // instead of a broken image until this is set. Alt text isn't an
  // admin-editable field -- ArtistSpotlight.jsx derives it from `name`.
  photo: null,
};

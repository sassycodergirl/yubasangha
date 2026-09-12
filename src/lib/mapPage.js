// "Map" page content -- seed value for the "map-banner" admin block. The
// map itself reuses the homepage's own "map" content block (src/lib/map.js)
// via getContent, so both places stay in sync from one admin screen.

export const mapPageBanner = {
  title: "Pandal Map",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Map", href: "/map" },
  ],
  // No banner photo yet -- falls back to the site's ambient gradient (see
  // SectionBackground) until an admin uploads one.
  backgroundImage: null,
};

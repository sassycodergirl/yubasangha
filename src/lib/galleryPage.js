// "Gallery" page content -- seed value for the "gallery-banner" admin
// block. The gallery itself reuses the homepage's own "gallery" content
// block (src/lib/gallery.js) via getContent, so both places stay in sync
// from one admin screen.

export const galleryPageBanner = {
  title: "Gallery",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gallery" },
  ],
  // No banner photo yet -- falls back to the site's ambient gradient (see
  // SectionBackground) until an admin uploads one.
  backgroundImage: null,
};

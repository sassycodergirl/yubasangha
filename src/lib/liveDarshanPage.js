// "Live Darshan" page content -- seed value for the "live-darshan-banner"
// admin block. The stream itself reuses the homepage's own "live-darshan"
// content block (src/lib/liveDarshan.js) via getContent, so both places
// stay in sync from one admin screen.

export const liveDarshanPageBanner = {
  title: "Live Darshan",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Live Darshan", href: "/live-darshan" },
  ],
  // No banner photo yet -- falls back to the site's ambient gradient (see
  // SectionBackground) until an admin uploads one.
  backgroundImage: null,
};

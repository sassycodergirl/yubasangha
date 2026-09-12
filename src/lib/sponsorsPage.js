// "Sponsors" page content -- seed value for the "sponsors-banner" admin
// block. The sponsor list itself reuses the homepage's own "sponsors"
// content block (src/lib/eventsSponsors.js) via getContent, so both places
// stay in sync from one admin screen.

export const sponsorsPageBanner = {
  title: "Our Sponsors",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Sponsors", href: "/sponsors" },
  ],
  // No banner photo yet -- falls back to the site's ambient gradient (see
  // SectionBackground) until an admin uploads one.
  backgroundImage: null,
};

import { siteConfig, heroContent, mainNav, donateConfig } from "@/lib/site";
import { aboutContent } from "@/lib/about";
import { themeContent } from "@/lib/theme";
import { festivalCountdown } from "@/lib/countdown";
import { scheduleContent } from "@/lib/schedule";
import { galleryContent } from "@/lib/gallery";
import { liveDarshanContent } from "@/lib/liveDarshan";
import { mapContent } from "@/lib/map";
import { sponsorsContent } from "@/lib/eventsSponsors";
import { footerContent } from "@/lib/footer";
import { aboutUsBanner, aboutIntroContent } from "@/lib/aboutUsPage";
import { themePageBanner, themeStoryContent, themeArtistContent } from "@/lib/themePage";
import { schedulePageBanner, scheduleTimelineContent } from "@/lib/schedulePage";
import { scheduleEventsContent } from "@/lib/scheduleEvents";
import { galleryPageBanner } from "@/lib/galleryPage";
import { liveDarshanPageBanner } from "@/lib/liveDarshanPage";
import { mapPageBanner } from "@/lib/mapPage";
import { sponsorsPageBanner } from "@/lib/sponsorsPage";
import { contactPageBanner, contactIntro, findUsContent } from "@/lib/contactPage";
import { eventsPageBanner } from "@/lib/eventsPage";

// Registry of every admin-editable content block. Each entry's `slug` is the
// Content row's unique key; `seed` is the Phase 1 static value used to
// create that row the first time (see prisma/seed.js) so the DB starts out
// matching the live site exactly. `pages` links a block to one or more pages
// in src/lib/admin/pages.js — a block listed under two pages (e.g. "about"
// under both "home" and "about-us") is ONE content row edited from either
// page's admin screen, so the admin never fills the same content in twice.
// Blocks with `pages: null` are site-wide ("Settings" in the admin nav, not
// tied to one page).
//
// Adding a new editable block = one more entry here, no migration needed —
// the AutoForm (src/components/admin/AutoForm.jsx) renders a form from
// whatever shape `seed`/`data` has.
// Array order below is also the order sections appear in each page's admin
// list (getSectionsForPage just filters this array), so a page's own
// banner/intro blocks are declared right before the shared homepage section
// they lead into — e.g. About Us reads Banner, Intro, About, not the other
// way round. This is independent of each public page's own rendering order
// (hardcoded per page.js), so reordering here only changes the admin UI.
export const sections = [
  { slug: "hero", type: "homepage_section", label: "Hero", pages: ["home"], seed: heroContent },

  // "about" is shared between the homepage and About Us -- one content row,
  // edited from either place (see getOtherPagesForSection below).
  { slug: "about-us-banner", type: "page_section", label: "Banner", pages: ["about-us"], seed: aboutUsBanner },
  { slug: "about-intro", type: "page_section", label: "Intro", pages: ["about-us"], seed: aboutIntroContent },
  { slug: "about", type: "homepage_section", label: "About", pages: ["home", "about-us"], seed: aboutContent },

  // "theme" is shared between the homepage and Theme 2026.
  { slug: "theme-banner", type: "page_section", label: "Banner", pages: ["theme-2026"], seed: themePageBanner },
  { slug: "theme-story", type: "page_section", label: "Theme Story", pages: ["theme-2026"], seed: themeStoryContent },
  { slug: "theme-artist", type: "page_section", label: "Artist Spotlight", pages: ["theme-2026"], seed: themeArtistContent },
  { slug: "theme", type: "homepage_section", label: "Theme 2026", pages: ["home", "theme-2026"], seed: themeContent },

  { slug: "countdown", type: "homepage_section", label: "Festival Countdown", pages: ["home"], seed: festivalCountdown },

  // "schedule-events" (the ritual list) is shared between the homepage and
  // the Schedule page -- each renders it differently (icons vs. photos +
  // description) but it's one list, edited once. Like "events" (the Events
  // collection), it gets its own top-level "Puja Schedule" nav item instead
  // of living under Pages -- see /admin/schedule -- so `pages: []` (not
  // shown under either page's own section list, but still tagged with both
  // for the "shared" bookkeeping getOtherPagesForSection relies on).
  // "schedule" (home) and "schedule-banner"/"schedule-timeline" (Schedule
  // page) stay under Pages -- they're each page's own presentation-only
  // chrome around that shared list, not shared themselves.
  { slug: "schedule", type: "homepage_section", label: "Puja Schedule Settings", pages: ["home"], seed: scheduleContent },
  { slug: "schedule-banner", type: "page_section", label: "Banner", pages: ["schedule"], seed: schedulePageBanner },
  { slug: "schedule-timeline", type: "page_section", label: "Intro", pages: ["schedule"], seed: scheduleTimelineContent },
  { slug: "schedule-events", type: "homepage_section", label: "Puja Schedule", pages: [], seed: scheduleEventsContent },

  // "gallery" (the photo list) is shared between the homepage and the
  // Gallery page -- same top-level-nav treatment as "schedule-events" above
  // (see /admin/gallery), so `pages: []`. "gallery-banner" stays under
  // Pages -- it's the Gallery page's own presentation-only chrome.
  { slug: "gallery-banner", type: "page_section", label: "Banner", pages: ["gallery"], seed: galleryPageBanner },
  { slug: "gallery", type: "homepage_section", label: "Gallery", pages: [], seed: galleryContent },

  // "live-darshan" (eyebrow/tagline/etc.) is shared between the homepage and
  // the Live Darshan page -- pure presentation, so it stays under Pages
  // (labeled "Live Darshan Settings", distinct from "Live Darshan" the
  // top-level nav item for the actual video collection -- see
  // /admin/live-darshan and src/lib/liveVideos.js).
  { slug: "live-darshan-banner", type: "page_section", label: "Banner", pages: ["live-darshan"], seed: liveDarshanPageBanner },
  { slug: "live-darshan", type: "homepage_section", label: "Live Darshan Settings", pages: ["home", "live-darshan"], seed: liveDarshanContent },

  // "map" (the pins/categories) is shared between the homepage and the Map
  // page -- same top-level-nav treatment as "gallery"/"schedule-events"
  // above (see /admin/map), so `pages: []`. "map-banner" stays under Pages
  // -- it's the Map page's own presentation-only chrome.
  { slug: "map-banner", type: "page_section", label: "Banner", pages: ["map"], seed: mapPageBanner },
  { slug: "map", type: "homepage_section", label: "Pandal Map", pages: [], seed: mapContent },

  {
    slug: "events",
    type: "homepage_section",
    label: "Upcoming Events (teaser)",
    pages: ["home"],
    // The actual featured event is pulled live from the Events collection
    // (src/lib/events.js), not stored here — this block is presentation-only
    // so an admin never has to duplicate an event's details onto the
    // homepage teaser.
    seed: {
      eyebrow: "Upcoming Events",
      viewAllHref: "/events",
      backgroundImage: null,
    },
  },
  { slug: "events-banner", type: "page_section", label: "Banner", pages: ["events"], seed: eventsPageBanner },

  // "sponsors" (the sponsor list) is shared between the homepage and the
  // Sponsors page -- same top-level-nav treatment as "gallery"/"map" above
  // (see /admin/sponsors), so `pages: []`. "sponsors-banner" stays under
  // Pages -- it's the Sponsors page's own presentation-only chrome.
  { slug: "sponsors-banner", type: "page_section", label: "Banner", pages: ["sponsors"], seed: sponsorsPageBanner },
  { slug: "sponsors", type: "homepage_section", label: "Sponsors", pages: [], seed: sponsorsContent },

  { slug: "contact-banner", type: "page_section", label: "Banner", pages: ["contact"], seed: contactPageBanner },
  { slug: "contact-intro", type: "page_section", label: "Intro", pages: ["contact"], seed: contactIntro },
  {
    slug: "find-us",
    type: "page_section",
    label: "Find Us",
    pages: ["contact"],
    // Address/phone/email/social themselves are NOT duplicated here — they
    // come from the shared "footer" global block. Only this page's own
    // photo + CTA live in this block.
    seed: findUsContent,
  },

  // Site-wide (Settings)
  {
    slug: "header",
    type: "global",
    label: "Header",
    pages: null,
    seed: {
      nav: mainNav,
      donate: {
        buttonLabel: "Donate",
        qrImage: donateConfig.qrImageSrc,
        orgName: donateConfig.orgName,
        upiId: donateConfig.upiId,
      },
    },
  },
  {
    slug: "branding",
    type: "global",
    label: "Branding",
    pages: null,
    // The logo lives here (not on "header") -- both Header and Footer reuse
    // this one uploaded logo. `iconImage` is a small decorative watermark
    // shown only on the admin dashboard (src/app/admin/page.js) -- distinct
    // from `favicon`, which is the actual browser-tab/bookmark icon for the
    // public site (wired up in src/app/layout.js's generateMetadata). `seo`
    // feeds the site-wide default title/description/social-preview-image/
    // keywords (see the same generateMetadata) -- any page can still set its
    // own `metadata.title` to override just the title, same as today.
    seed: {
      logo: "/logo-yuba.png",
      iconImage: null,
      favicon: null,
      name: siteConfig.name,
      secondaryName: siteConfig.secondaryName,
      fullName: siteConfig.fullName,
      edition: siteConfig.edition,
      location: heroContent.location,
      seo: {
        title: siteConfig.fullName,
        description: "Yuba Sangha community and Durga Puja website.",
        keywords: "Durga Puja, Telipukur, Yuba Sangha, Kolkata, Puja Pandal",
        ogImage: null,
      },
    },
  },
  {
    slug: "footer",
    type: "global",
    label: "Footer",
    pages: null,
    // Reused directly by the Contact page (address/phone/email/social) --
    // see "find-us" above.
    seed: footerContent,
  },
];

export function findSection(slug) {
  return sections.find((section) => section.slug === slug);
}

export function getSectionsForPage(pageSlug) {
  return sections.filter((section) => section.pages?.includes(pageSlug));
}

// Every other page a shared section also appears on, besides the one being
// viewed -- used to show "Also on <page>" in the admin so it's clear editing
// this block changes more than one page.
export function getOtherPagesForSection(section, currentPageSlug) {
  return (section.pages ?? []).filter((slug) => slug !== currentPageSlug);
}

export function getSettingsSections() {
  return sections.filter((section) => section.pages === null);
}

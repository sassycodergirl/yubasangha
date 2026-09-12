// "Our Sponsors" homepage section content (Phase 1 static/seed shape). The
// "Upcoming Events" teaser next to it is presentation-only now (see the
// "events" entry in src/lib/admin/sections.js) -- the event it shows comes
// live from the Events collection (src/lib/events.js), not from here, so an
// admin never has to enter the same event twice.
//
// NOTE: placeholder content only. Deliberately not reproducing a real
// company's logo under "sponsors" -- not confirmed, and putting one on the
// live site would misrepresent a sponsorship that may not exist. Swap in the
// actual confirmed sponsor names + logos once finalized.

export const sponsorsContent = {
  eyebrow: "Our Sponsors",
  viewAllHref: "/contact",
  sponsors: [
    { id: "s1", tier: "Diamond", name: "Sponsor Name", logo: "/sponsors/placeholder-1.svg" },
    { id: "s2", tier: "Platinum", name: "Sponsor Name", logo: "/sponsors/placeholder-2.svg" },
    { id: "s3", tier: "Gold", name: "Sponsor Name", logo: "/sponsors/placeholder-3.svg" },
    { id: "s4", tier: "Silver", name: "Sponsor Name", logo: "/sponsors/placeholder-4.svg" },
    { id: "s5", tier: "Gold", name: "Sponsor Name", logo: "/sponsors/placeholder-5.svg" },
    { id: "s6", tier: "Silver", name: "Sponsor Name", logo: "/sponsors/placeholder-6.svg" },
  ],
};

// "About Us" page content -- seed values for the "about-us-banner" and
// "about-intro" admin blocks (see src/lib/admin/sections.js). The public
// page pulls the live/edited values via getContent, not this file directly.

export const aboutUsBanner = {
  title: "About Us",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
  ],
  // No banner photo yet -- falls back to the site's ambient gradient (see
  // SectionBackground) until an admin uploads one.
  backgroundImage: null,
};

export const aboutIntroContent = {
  subtitle: "Who We Are",
  title: ["A Community Bound", "by Faith & Festivity"],
  description: [
    "Telipukur Yuba Sangha & Nursery Bagan Adivasi Brinda has been the heart of Durga Puja celebrations in our neighborhood for over seven decades — a gathering point for families, friends, and generations of devotees.",
    "What began as a small, humble initiative has grown into one of the most cherished community pujas in the region, rooted in devotion and driven entirely by volunteers who give their time and heart every year.",
  ],
  // No photo uploaded yet -- AboutIntro shows a decorative placeholder
  // instead of a broken image until this is set. Alt text isn't an
  // admin-editable field -- AboutIntro.jsx hardcodes it since it's always
  // the same photo of the same subject.
  image: null,
};

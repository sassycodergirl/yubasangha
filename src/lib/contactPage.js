// "Contact" page content -- seed values for the "contact-banner",
// "contact-intro" and "find-us" admin blocks. Address/phone/email/social
// come from the existing "footer" content block instead (one source of
// truth, same data an admin already edits from Settings > Footer); only the
// parts specific to this page (banner, intro copy, "Find Us" photo) live
// here.

export const contactPageBanner = {
  title: "Contact Us",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ],
  // No banner photo yet -- falls back to the site's ambient gradient (see
  // SectionBackground) until an admin uploads one.
  backgroundImage: null,
};

export const contactIntro = {
  subtitle: "Get In Touch",
  title: ["We'd Love to", "Hear From You"],
  description:
    "Whether you have a question about this year's celebration, want to volunteer, or wish to become a sponsor -- reach out any time. We're happy to help.",
};

export const findUsContent = {
  // No photo uploaded yet -- ContactInfo shows a placeholder instead of a
  // broken image until this is set (same convention as About Us's intro
  // photo, see src/lib/aboutUsPage.js).
  image: null,
  imageAlt: "Telipukur Yuba Sangha pandal",
  cta: { label: "View Pandal Map", href: "/map" },
};

// Global footer content (Phase 1 static). Phase 2: link lists, contact
// details, social links, and the newsletter blurb all become admin-managed
// under the CMS "Settings" resource -- one place, since they change rarely
// but together, rather than per-page.
//
// NOTE: address/phone/email below are placeholders in the reference's
// format, not confirmed real details -- swap for the organization's actual
// contact info before launch.

export const footerContent = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Theme 2026", href: "/theme-2026" },
    { label: "Schedule", href: "/schedule" },
    { label: "Gallery", href: "/gallery" },
    { label: "Live Darshan", href: "/live-darshan" },
  ],
  usefulLinks: [
    { label: "Map", href: "/map" },
    { label: "Events", href: "/events" },
    { label: "News & Updates", href: "/news" },
    { label: "Sponsors", href: "/sponsors" },
    { label: "Donation", href: "/contact#donate" },
    { label: "FAQ", href: "/contact#faq" },
  ],
  contact: {
    addressLines: ["Telipukur, B.T. Road", "Kolkata - 700 014, India"],
    phone: "+91 89745 67890",
    email: "info@telipukuryubasangha.org",
    socialNote: "Follow us on Social Media",
  },
  social: [
    { id: "facebook", label: "Facebook", href: "https://facebook.com" },
    { id: "instagram", label: "Instagram", href: "https://instagram.com" },
    { id: "youtube", label: "YouTube", href: "https://youtube.com" },
    { id: "x", label: "X", href: "https://x.com" },
  ],
  // The "Made with ❤ by Coderbeans" credit is intentionally NOT here -- it's
  // the developer's own signature, hardcoded directly in Footer.jsx, not
  // admin-editable content.
};

// Site-wide static config for Phase 1 (public site).
// In Phase 2 some of this (name, socials, contact) moves to the CMS "Settings".

export const siteConfig = {
  name: "Telipukur Yuba Sangha",
  fullName: "Telipukur Yuba Sangha & Nursery Bagan Adivasi Brinda",
  secondaryName: "& Nursery Bagan Adivasi Brinda",
  edition: "Durga Puja 2026",
  tagline: "Community • Culture • Durga Puja",
  description: "Yuba Sangha community and Durga Puja website.",
};

// Public navigation. `href` matches folders under app/(public)/.
// Order here matches the site header.
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Theme 2026", href: "/theme-2026" },
  { label: "Schedule", href: "/schedule" },
  { label: "Gallery", href: "/gallery" },
  { label: "Live Darshan", href: "/live-darshan" },
  { label: "Map", href: "/map" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

// Hero / banner content (Phase 1 static; Phase 2 -> CMS "Pages"/"Settings").
export const heroContent = {
  bannerImage: "/hero-banner.webp",
  motif: ["শক্তি", "সংস্কৃতি", "সংস্কৃতি"],
  titleLines: ["DURGA", "PUJA 2026"],
  tagline: "A tradition of devotion. A legacy of togetherness.",
  location: "Kolkata, India",
  actions: {
    primary: { label: "Explore the Theme", href: "/theme-2026" },
    darshan: { label: "Live Darshan", href: "/live-darshan" },
  },
  countdown: {
    label: "Countdown to Mahalaya",
    // Mahalaya 2026 (IST).
    target: "2026-09-17T00:00:00+05:30",
    occasion: "Mahalaya",
    date: "17 September 2026",
    weekday: "Thursday",
  },
};

// Donate modal content. Phase 1: static placeholder QR in /public. Phase 2:
// admin uploads the real QR (Cloudinary/UploadThing) and this whole object
// moves to the CMS "Settings" resource -- the modal itself won't need to
// change, just where this data comes from.
export const donateConfig = {
  qrImageSrc: "/qr-donate.svg",
  qrImageAlt: `QR code to donate to ${siteConfig.name} (placeholder)`,
  orgName: siteConfig.name,
  upiId: "telipukuryubasangha@upi",
};

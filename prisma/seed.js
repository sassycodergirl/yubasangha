// One-time bootstrap: creates the single admin user and loads the Phase 1
// static homepage content into the `Content` table so the DB starts out
// matching the live site. Run via `npx prisma db seed`.
//
// The section data below is intentionally a copy of src/lib/<section>.js at
// the time Phase 2 started, not a live import — this script runs as plain
// CommonJS Node outside Next's bundler, and those files are ES modules. Once
// seeded, the DB copy is what the admin edits; this file is never read again.

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const sections = [
  {
    slug: "hero",
    type: "homepage_section",
    label: "Hero",
    data: {
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
        target: "2026-09-17T00:00:00+05:30",
        occasion: "Mahalaya",
        date: "17 September 2026",
        weekday: "Thursday",
      },
    },
  },
  {
    slug: "about",
    type: "homepage_section",
    label: "About",
    data: {
      subtitle: "Our Legacy",
      title: ["About Telipukur Yuba Sangha", "& Nursery Bagan Adivasi Brinda"],
      description:
        "For decades, our puja has been more than a celebration — it is a promise kept, a culture preserved, and a bond strengthened with every heartbeat of this community.",
      stats: [
        { value: "70+", label: "Yrs of Legacy" },
        { value: "500+", label: "Volunteers" },
        { value: "100K+", label: "Visiting Every Year" },
        { value: "50+", label: "Awards Won" },
      ],
      cta: { label: "Our Journey", href: "/about-us" },
      timeline: [
        {
          year: "1954",
          title: "The journey begins.",
          description: "A small initiative with a big dream.",
          image: "/about/milestone-1954.svg",
        },
        {
          year: "1980",
          title: "Growing stronger.",
          description: "More hands, one purpose.",
          image: "/about/milestone-1980.svg",
        },
        {
          year: "2026",
          title: "Continuing the legacy.",
          description: "Honoring tradition, embracing the future.",
          image: "/about/milestone-2026.svg",
        },
      ],
      values: ["Unity", "Devotion", "Culture", "Service"],
      // Used only when this section renders with `showTimeline={false}`
      // (the About Us page) in place of the milestone timeline -- a small
      // two-photo collage instead.
      collageImages: [null, null],
      backgroundImage: null,
    },
  },
  {
    slug: "theme",
    type: "homepage_section",
    label: "Theme 2026",
    data: {
      eyebrow: "Theme 2026",
      title: "Shashwat",
      subtitle: "(Sanatan)",
      taglineLines: ["Eternal Roots.", "Timeless Spirit."],
      cta: { label: "Discover the Story", href: "/theme-2026" },
      gallery: [
        { label: "Concept Art", image: "/theme/concept-art.svg" },
        { label: "Mood Board", image: "/theme/mood-board.svg" },
        { label: "3D Render", image: "/theme/render.svg" },
        { label: "Artist Sketch", image: "/theme/artist-sketch.svg" },
        { label: "Behind the Scenes", image: "/theme/behind-scenes.svg" },
      ],
      backgroundImage: null,
    },
  },
  {
    slug: "countdown",
    type: "homepage_section",
    label: "Festival Countdown",
    data: {
      eyebrow: "Festival Countdown",
      backgroundImage: null,
      occasions: [
        { label: "Mahalaya", date: "2026-09-17", dateLabel: "17 Sept", featured: true },
        { label: "Shashthi", date: "2026-09-22", dateLabel: "22 Sept" },
        { label: "Saptami", date: "2026-09-23", dateLabel: "23 Sept" },
        { label: "Ashtami", date: "2026-09-24", dateLabel: "24 Sept" },
        { label: "Navami", date: "2026-09-25", dateLabel: "25 Sept" },
        { label: "Dashami", date: "2026-09-26", dateLabel: "26 Sept" },
      ],
    },
  },
  {
    slug: "schedule",
    type: "homepage_section",
    label: "Puja Schedule Settings",
    data: {
      eyebrow: "Puja Schedule",
      cta: { label: "View Full Schedule", href: "/schedule" },
      backgroundImage: null,
    },
  },
  {
    slug: "gallery",
    type: "homepage_section",
    label: "Gallery",
    data: {
      eyebrow: "Gallery",
      filters: [
        { id: "all", label: "All" },
        { id: "pandal", label: "Pandal" },
        { id: "idol", label: "Idol" },
        { id: "culture", label: "Culture" },
        { id: "drone", label: "Drone Shots" },
        { id: "videos", label: "Videos" },
      ],
      images: [
        { id: "g1", src: "/gallery/g1-idol-closeup.svg", alt: "Close-up of the Durga idol", categories: ["idol"], ratio: 0.72 },
        { id: "g2", src: "/gallery/g2-pandal-arch.svg", alt: "Pandal entrance archway", categories: ["pandal"], ratio: 1.25 },
        { id: "g3", src: "/gallery/g3-pandal-night.svg", alt: "Illuminated pandal at night", categories: ["pandal", "culture"], ratio: 1.7 },
        { id: "g4", src: "/gallery/g4-idol-detail.svg", alt: "Idol ornamentation detail", categories: ["idol"], ratio: 1.25 },
        { id: "g5", src: "/gallery/g5-fireworks.svg", alt: "Fireworks over the pandal", categories: ["culture"], ratio: 1.25 },
        { id: "g6", src: "/gallery/g6-culture-stage.svg", alt: "Cultural evening performance", categories: ["culture"], ratio: 1.25 },
        { id: "g7", src: "/gallery/g7-drone-aerial.svg", alt: "Aerial drone view of the pandal", categories: ["drone"], ratio: 0.72 },
        { id: "g8", src: "/gallery/g8-interior-corridor.svg", alt: "Pandal interior corridor", categories: ["pandal"], ratio: 0.72 },
      ],
      viewAll: { label: "View All Gallery", href: "/gallery" },
    },
  },
  {
    slug: "live-darshan",
    type: "homepage_section",
    label: "Live Darshan Settings",
    data: {
      eyebrow: "Live Darshan",
      tagline: "Seek blessings from Maa, no matter where you are.",
      cta: { label: "Watch Live", href: "#live-video" },
      devoteesLabel: "Devotees Online",
      fullscreenLabel: "Open in Fullscreen",
      backgroundImage: null,
    },
  },
  {
    slug: "map",
    type: "homepage_section",
    label: "Pandal Map",
    data: {
      title: ["Interactive", "Pandal Map"],
      tagline: "Navigate your way around the pandal with ease.",
      cta: { label: "Explore Map", href: "/map" },
      categories: [
        { id: "entry", label: "Entry", color: "#4ade80", icon: "entry" },
        { id: "exit", label: "Exit", color: "#38bdf8", icon: "exit" },
        { id: "vip", label: "VIP Lounge", color: "#a78bfa", icon: "vip" },
        { id: "bhog", label: "Bhog Area", color: "#f59e0b", icon: "bhog" },
        { id: "washroom", label: "Washroom", color: "#38bdf8", icon: "washroom" },
        { id: "firstaid", label: "First Aid", color: "#ef4444", icon: "firstaid" },
        { id: "foodcourt", label: "Food Court", color: "#f59e0b", icon: "food" },
        { id: "kidszone", label: "Kids Zone", color: "#f472b6", icon: "kids" },
        { id: "parking", label: "Parking", color: "#34d399", icon: "parking" },
        { id: "wheelchair", label: "Wheelchair Access", color: "#c99a3b", icon: "wheelchair" },
        { id: "selfie", label: "Selfie Zone", color: "#e5e7eb", icon: "camera" },
        { id: "emergency", label: "Emergency Exit", color: "#22c55e", icon: "emergency" },
      ],
      mapImage: "/map/pandal-map.svg",
      pins: [
        { id: "p1", categoryId: "entry", x: 12, y: 68 },
        { id: "p2", categoryId: "exit", x: 88, y: 66 },
        { id: "p3", categoryId: "vip", x: 50, y: 24 },
        { id: "p4", categoryId: "bhog", x: 30, y: 42 },
        { id: "p5", categoryId: "washroom", x: 70, y: 78 },
        { id: "p6", categoryId: "firstaid", x: 20, y: 82 },
        { id: "p7", categoryId: "foodcourt", x: 78, y: 34 },
        { id: "p8", categoryId: "kidszone", x: 60, y: 58 },
        { id: "p9", categoryId: "parking", x: 8, y: 32 },
        { id: "p10", categoryId: "wheelchair", x: 45, y: 85 },
        { id: "p11", categoryId: "selfie", x: 55, y: 46 },
        { id: "p12", categoryId: "emergency", x: 90, y: 22 },
      ],
    },
  },
  {
    slug: "events",
    type: "homepage_section",
    label: "Upcoming Events (teaser)",
    // Presentation-only -- the event it shows comes live from the Events
    // collection below (type "event"), not from here.
    data: {
      eyebrow: "Upcoming Events",
      viewAllHref: "/events",
      backgroundImage: null,
    },
  },
  {
    slug: "sponsors",
    type: "homepage_section",
    label: "Sponsors",
    data: {
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
    },
  },
  {
    slug: "about-us-banner",
    type: "page_section",
    label: "Banner",
    data: {
      title: "About Us",
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about-us" },
      ],
      backgroundImage: null,
    },
  },
  {
    slug: "about-intro",
    type: "page_section",
    label: "Intro",
    data: {
      subtitle: "Who We Are",
      title: ["A Community Bound", "by Faith & Festivity"],
      description: [
        "Telipukur Yuba Sangha & Nursery Bagan Adivasi Brinda has been the heart of Durga Puja celebrations in our neighborhood for over seven decades — a gathering point for families, friends, and generations of devotees.",
        "What began as a small, humble initiative has grown into one of the most cherished community pujas in the region, rooted in devotion and driven entirely by volunteers who give their time and heart every year.",
      ],
      image: null,
    },
  },
  {
    slug: "theme-banner",
    type: "page_section",
    label: "Banner",
    data: {
      title: "Theme 2026",
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: "Theme 2026", href: "/theme-2026" },
      ],
      backgroundImage: null,
    },
  },
  {
    slug: "theme-story",
    type: "page_section",
    label: "Theme Story",
    data: {
      subtitle: "This Year's Theme",
      title: ["Shashwat", "(Sanatan)"],
      description: [
        "Every year, our pandal tells a story — this year, it's one of roots that never let go. \"Shashwat\" is a meditation on what stays constant even as everything around it changes: faith passed from one generation to the next, rituals that outlive the hands that first performed them.",
        "The design draws from centuries-old temple motifs and folk craft traditions, reimagined at pandal scale — a tribute to the artisans and storytellers who kept these forms alive long before they became inspiration for a festival.",
      ],
      image: null,
    },
  },
  {
    slug: "theme-artist",
    type: "page_section",
    label: "Artist Spotlight",
    data: {
      subtitle: "The Artist",
      name: "Bhabatosh Sutar",
      role: "Concept & Set Design",
      quote: "A pandal should feel like memory you can walk into.",
      bio: "Bhabatosh has led the creative direction of our puja for the past three editions, drawing on a background in set design and traditional Bengali craft. This year's theme grew out of conversations with the artisans who still practice the techniques it's built around.",
      photo: null,
    },
  },
  {
    slug: "schedule-banner",
    type: "page_section",
    label: "Banner",
    data: {
      title: "Puja Schedule",
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: "Schedule", href: "/schedule" },
      ],
      backgroundImage: null,
    },
  },
  {
    slug: "schedule-timeline",
    type: "page_section",
    label: "Intro",
    data: {
      subtitle: "Day of Devotion",
      title: ["A Day Woven", "in Ritual & Rhythm"],
      description:
        "From the first Mangal Aroti at dawn to the immersion procession at night, every hour of Ashtami carries its own ritual and its own energy. Here's how the day unfolds.",
    },
  },
  {
    slug: "schedule-events",
    type: "homepage_section",
    label: "Puja Schedule",
    data: {
      events: [
        { time: "06:00 AM", label: "Mangal Aroti", icon: "aroti", image: null, description: "The day begins with the first offering of light to the Goddess, as the pandal wakes to the sound of conch shells and bells." },
        { time: "08:00 AM", label: "Pushpaanjali", icon: "flower", image: null, description: "Devotees gather for the communal flower offering, repeating the mantras together in one voice." },
        { time: "12:30 PM", label: "Bhog", icon: "bhog", image: null, description: "A shared meal, cooked and served by volunteers to hundreds of visitors across the afternoon." },
        { time: "04:00 PM", label: "Sandhi Puja", icon: "temple", image: null, description: "The most sacred 48 minutes of the festival, bridging Ashtami and Navami with 108 lamps and offerings." },
        { time: "07:00 PM", label: "Cultural Events", icon: "dance", image: null, description: "An evening of music, dance, and performances on the community stage, open to every generation." },
        { time: "08:30 PM", label: "Dhunuchi Naach", icon: "drum", image: null, description: "Dancers carry burning incense pots in a rhythmic offering, one of the night's most striking sights." },
        { time: "10:00 PM", label: "Immersion", icon: "immersion", image: null, description: "The idol is carried through the streets in procession for its final journey to the river." },
      ],
    },
  },
  {
    slug: "gallery-banner",
    type: "page_section",
    label: "Banner",
    data: {
      title: "Gallery",
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: "Gallery", href: "/gallery" },
      ],
      backgroundImage: null,
    },
  },
  {
    slug: "live-darshan-banner",
    type: "page_section",
    label: "Banner",
    data: {
      title: "Live Darshan",
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: "Live Darshan", href: "/live-darshan" },
      ],
      backgroundImage: null,
    },
  },
  {
    slug: "map-banner",
    type: "page_section",
    label: "Banner",
    data: {
      title: "Pandal Map",
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: "Map", href: "/map" },
      ],
      backgroundImage: null,
    },
  },
  {
    slug: "sponsors-banner",
    type: "page_section",
    label: "Banner",
    data: {
      title: "Our Sponsors",
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: "Sponsors", href: "/sponsors" },
      ],
      backgroundImage: null,
    },
  },
  {
    slug: "events-banner",
    type: "page_section",
    label: "Banner",
    data: {
      title: "Events",
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: "Events", href: "/events" },
      ],
      backgroundImage: null,
    },
  },
  {
    slug: "contact-banner",
    type: "page_section",
    label: "Banner",
    data: {
      title: "Contact Us",
      breadcrumb: [
        { label: "Home", href: "/" },
        { label: "Contact", href: "/contact" },
      ],
      backgroundImage: null,
    },
  },
  {
    slug: "contact-intro",
    type: "page_section",
    label: "Intro",
    data: {
      subtitle: "Get In Touch",
      title: ["We'd Love to", "Hear From You"],
      description:
        "Whether you have a question about this year's celebration, want to volunteer, or wish to become a sponsor -- reach out any time. We're happy to help.",
    },
  },
  {
    slug: "find-us",
    type: "page_section",
    label: "Find Us",
    data: {
      image: null,
      imageAlt: "Telipukur Yuba Sangha pandal",
      cta: { label: "View Pandal Map", href: "/map" },
    },
  },
  {
    slug: "header",
    type: "global",
    label: "Header",
    data: {
      nav: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about-us" },
        { label: "Theme 2026", href: "/theme-2026" },
        { label: "Schedule", href: "/schedule" },
        { label: "Gallery", href: "/gallery" },
        { label: "Live Darshan", href: "/live-darshan" },
        { label: "Map", href: "/map" },
        { label: "Events", href: "/events" },
        { label: "Contact", href: "/contact" },
      ],
      donate: {
        buttonLabel: "Donate",
        qrImage: "/qr-donate.svg",
        orgName: "Telipukur Yuba Sangha",
        upiId: "telipukuryubasangha@upi",
      },
    },
  },
  {
    slug: "branding",
    type: "global",
    label: "Branding",
    data: {
      logo: "/logo-yuba.png",
      iconImage: null,
      favicon: null,
      name: "Telipukur Yuba Sangha",
      secondaryName: "& Nursery Bagan Adivasi Brinda",
      fullName: "Telipukur Yuba Sangha & Nursery Bagan Adivasi Brinda",
      edition: "Durga Puja 2026",
      location: "Kolkata, India",
      seo: {
        title: "Telipukur Yuba Sangha & Nursery Bagan Adivasi Brinda",
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
    data: {
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
      // No "madeWith" here -- it's the developer's signature, hardcoded in
      // Footer.jsx, not admin-editable content.
    },
  },
];

// Seed rows for the Events collection (src/lib/events.js) -- each is its own
// Content row (type "event"), ordered by `order`. `dateLabel` isn't stored;
// it's derived from `date` at render time (see src/lib/dateFormat.js).
//
// NOTE: placeholder content only -- deliberately not using a real,
// identifiable celebrity's name. Swap in the real event lineup once
// finalized.
const events = [
  {
    slug: "e1",
    title: "An Evening of Live Music",
    data: {
      category: "Cultural Night",
      title: "An Evening of Live Music",
      date: "2026-09-23T19:30:00+05:30",
      time: "07:30 PM Onwards",
      venue: "Main Pandal Stage",
      image: "/events/cultural-night.svg",
      summary: "A night of live performances celebrating the region's musical heritage.",
      description:
        "Join us for an evening of live music as local artists take the main stage to celebrate the region's rich musical heritage. Expect a mix of classical, folk, and contemporary performances, open to all ages and free to attend for every visitor to the pandal.",
    },
  },
  {
    slug: "e2",
    title: "Dhunuchi Naach Competition",
    data: {
      category: "Competition",
      title: "Dhunuchi Naach Competition",
      date: "2026-09-24T20:30:00+05:30",
      time: "08:30 PM Onwards",
      venue: "Main Pandal Courtyard",
      image: null,
      summary: "Dancers compete with burning incense pots in this striking traditional ritual dance.",
      description:
        "One of the most visually striking traditions of Durga Puja, dancers balance and swirl burning dhunuchi (incense pots) in a rhythmic offering to the Goddess. This year's competition is open to all age groups, with prizes for the most graceful and energetic performances.",
    },
  },
  {
    slug: "e3",
    title: "Kids' Fancy Dress Show",
    data: {
      category: "Kids",
      title: "Kids' Fancy Dress Show",
      date: "2026-09-25T17:00:00+05:30",
      time: "05:00 PM Onwards",
      venue: "Community Hall",
      image: null,
      summary: "Our youngest devotees dress up as mythological and cultural characters.",
      description:
        "Children from the community dress up as their favourite mythological and cultural characters and take to the stage in a joyful celebration of imagination and heritage. Open to children aged 4-12; registration is available at the community hall on the day.",
    },
  },
  {
    slug: "e4",
    title: "Antakshari Night",
    data: {
      category: "Cultural Night",
      title: "Antakshari Night",
      date: "2026-09-26T19:00:00+05:30",
      time: "07:00 PM Onwards",
      venue: "Main Pandal Stage",
      image: null,
      summary: "Teams battle it out in this beloved musical word-chain game.",
      description:
        "A community favourite returns -- teams face off in Antakshari, the beloved musical word-chain game, spanning decades of Bengali and Hindi film music. Form a team of up to 5 and sign up at the registration desk before the evening begins.",
    },
  },
  {
    slug: "e5",
    title: "Prize Distribution & Closing Ceremony",
    data: {
      category: "Ceremony",
      title: "Prize Distribution & Closing Ceremony",
      date: "2026-09-27T18:00:00+05:30",
      time: "06:00 PM Onwards",
      venue: "Main Pandal Stage",
      image: null,
      summary: "Winners from the week's competitions are honoured as the festival draws to a close.",
      description:
        "As the festival draws to a close, we gather to honour the winners of this year's competitions -- from the Dhunuchi Naach to the Kids' Fancy Dress Show -- and thank the volunteers whose work made the celebration possible. All devotees are welcome to attend.",
    },
  },
];

// Seed rows for the Live Darshan video collection (src/lib/liveVideos.js) --
// each is its own Content row (type "live-video"). The first one is marked
// `featured` (the one the homepage shows) so a fresh install matches the
// live site exactly, same as the events seed above.
const liveVideos = [
  {
    slug: "v1",
    title: "Live Darshan",
    data: {
      title: "Live Darshan",
      youtubeVideoId: "fO9e9jnhYK8",
      featured: true,
    },
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local before seeding (used once, to create the admin login)."
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`Admin user ready: ${email}`);

  for (const section of sections) {
    await db.content.upsert({
      where: { type_slug: { type: section.type, slug: section.slug } },
      update: {}, // never overwrite content an admin may have already edited
      create: {
        type: section.type,
        slug: section.slug,
        title: section.label,
        data: section.data,
      },
    });
  }
  console.log(`Seeded ${sections.length} content blocks.`);

  for (const [index, event] of events.entries()) {
    await db.content.upsert({
      where: { type_slug: { type: "event", slug: event.slug } },
      update: {}, // never overwrite content an admin may have already edited
      create: {
        type: "event",
        slug: event.slug,
        title: event.title,
        data: event.data,
        order: index,
        published: true,
      },
    });
  }
  console.log(`Seeded ${events.length} events.`);

  for (const [index, video] of liveVideos.entries()) {
    await db.content.upsert({
      where: { type_slug: { type: "live-video", slug: video.slug } },
      update: {}, // never overwrite content an admin may have already edited
      create: {
        type: "live-video",
        slug: video.slug,
        title: video.title,
        data: video.data,
        order: index,
        published: true,
      },
    });
  }
  console.log(`Seeded ${liveVideos.length} live videos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

// "Interactive Pandal Map" homepage section content (Phase 1 static).
// Phase 2: `mapImage`, `categories` and `pins` become admin-managed --
// once the real isometric map render exists, an admin uploads it and
// places pins (x/y stored as a percentage of the image, not pixels, so
// they stay correctly positioned at any render size) from /admin.
//
// NOTE: `pins` below are placeholder positions scattered across the
// placeholder map graphic, not the real pandal layout -- replace once the
// actual map and coordinates are ready.

export const mapContent = {
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
};

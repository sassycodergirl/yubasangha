// "Meet the Artist" page content -- seed values for the "artist-banner" and
// "artist-process" admin blocks (see src/lib/admin/sections.js). The page's
// own spotlight section reuses the "theme-artist" block (src/lib/themePage.js)
// as-is, same as the Theme 2026 page, so an admin only ever fills in the
// artist's name/role/quote/bio/photo once.

export const artistPageBanner = {
  title: "Meet the Artist",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Meet the Artist", href: "/artist" },
  ],
  // No banner photo yet -- falls back to the site's ambient gradient (see
  // SectionBackground) until an admin uploads one.
  backgroundImage: null,
};

// "Behind The Craft" -- two independent, separately-toggleable pieces (see
// ArtistProcess.jsx and ArtistProcessForm.jsx, the dedicated admin screen
// for this block -- too much custom layout logic for the generic AutoForm
// to render well):
//   - `cardsEnabled`/`steps`: the numbered card row. No `icon` field any
//     more (the cards no longer show one) -- just a number, a title, and a
//     description, admin-addable/removable like any other list.
//   - `contentEnabled`/`contentRows`: a free-form "heading + rich text +
//     optional image" block (or several), stacked below the card row, its
//     own on/off switch independent of `cardsEnabled`. Per row:
//       - `body` is rich text (bold/italic/lists/links) via a Tiptap editor
//         (src/components/admin/RichTextEditor.jsx), stored as HTML.
//       - `imageEnabled` turns that row's image on/off.
//       - `imageColumn`: 6 (half-width, beside the text) or 12 (full-width,
//         stacked above the text). Off or 12 both mean the text takes the
//         full width -- a 12-wide image just also shows above it.
export const artistProcessContent = {
  cardsEnabled: true,
  subtitle: "Behind The Craft",
  title: ["The Making of", "a Memory"],
  description:
    "A pandal isn't built in a season -- it's built on everything that came before it. Here's a glimpse into how this year's theme took shape, from the first sketch to the last finishing touch.",
  steps: [
    {
      number: "01",
      title: "Research & Roots",
      description:
        "Every theme starts months early, in conversation -- with artisans, elders, and the old craft traditions the design will draw from.",
    },
    {
      number: "02",
      title: "Material & Craft",
      description:
        "Clay, bamboo, cloth, and paint, chosen the way they've always been -- by hand, by eye, and by what the materials themselves allow.",
    },
    {
      number: "03",
      title: "Narrative & Form",
      description:
        "The structure takes shape around a single idea, so that walking through the pandal feels like walking through the story itself.",
    },
    {
      number: "04",
      title: "Artisans & Community",
      description:
        "Dozens of hands finish what one vision starts -- volunteers and craftspeople working side by side through the final weeks.",
    },
  ],
  contentEnabled: true,
  contentRows: [
    {
      heading: "",
      body: "",
      image: null,
      imageEnabled: false,
      imageColumn: 6,
    },
  ],
  cta: { label: "Explore This Year's Theme", href: "/theme-2026" },
};

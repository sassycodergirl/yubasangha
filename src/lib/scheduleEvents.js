// Shared "Puja Schedule" ritual list -- one content block, edited once from
// either the Homepage or Schedule page admin screen (see the "schedule-events"
// entry in src/lib/admin/sections.js). The homepage's Puja Schedule section
// renders each ritual as an icon + time + label; the Schedule page's day
// timeline renders the same rituals with a photo + description as well --
// each component just reads the fields it needs, so an admin only ever
// enters a ritual's time/label/icon/photo/description in one place.
//
// `icon` is a key into the ICONS map in PujaSchedule.jsx -- keep it to that
// fixed set of names (aroti, flower, bhog, temple, dance, drum, immersion)
// rather than free text.
export const scheduleEventsContent = {
  events: [
    {
      time: "06:00 AM",
      label: "Mangal Aroti",
      icon: "aroti",
      image: null,
      description: "The day begins with the first offering of light to the Goddess, as the pandal wakes to the sound of conch shells and bells.",
    },
    {
      time: "08:00 AM",
      label: "Pushpaanjali",
      icon: "flower",
      image: null,
      description: "Devotees gather for the communal flower offering, repeating the mantras together in one voice.",
    },
    {
      time: "12:30 PM",
      label: "Bhog",
      icon: "bhog",
      image: null,
      description: "A shared meal, cooked and served by volunteers to hundreds of visitors across the afternoon.",
    },
    {
      time: "04:00 PM",
      label: "Sandhi Puja",
      icon: "temple",
      image: null,
      description: "The most sacred 48 minutes of the festival, bridging Ashtami and Navami with 108 lamps and offerings.",
    },
    {
      time: "07:00 PM",
      label: "Cultural Events",
      icon: "dance",
      image: null,
      description: "An evening of music, dance, and performances on the community stage, open to every generation.",
    },
    {
      time: "08:30 PM",
      label: "Dhunuchi Naach",
      icon: "drum",
      image: null,
      description: "Dancers carry burning incense pots in a rhythmic offering, one of the night's most striking sights.",
    },
    {
      time: "10:00 PM",
      label: "Immersion",
      icon: "immersion",
      image: null,
      description: "The idol is carried through the streets in procession for its final journey to the river.",
    },
  ],
};

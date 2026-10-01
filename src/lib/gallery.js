import { getContent } from "@/lib/getContent";
import { getInstagramEmbedUrl } from "@/lib/videoEmbeds";
import { getInstagramThumbnail } from "@/lib/instagramThumbnail";

// "Gallery" homepage section content (Phase 1 static). Phase 2: `images`
// becomes an admin-managed collection -- upload, tag with one or more
// `categories` (from the fixed `filters` list below, picked from a
// dropdown/checkboxes, not free text). `ratio` (width / height) drives the
// justified-row layout in Gallery.jsx; in Phase 2 this can be read straight
// off the uploaded file's real dimensions instead of being set by hand.
//
// An item can be a video instead of a photo: set `isVideo: true` and
// `videoUrl` to a YouTube, Facebook, or Instagram video link (any shape --
// see src/lib/videoEmbeds.js for exactly which URL patterns each platform
// matches), or a direct video file URL. Anything else an admin pastes (a
// profile link, a TikTok link, etc.) falls through to a plain <video> tag
// and won't play. `src` is still required on a video item -- it's the
// poster/thumbnail shown in the grid (and used as the <video> element's
// poster) since the justified layout needs a real image to size and lay out
// every tile, video or not.

export const galleryContent = {
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
    {
      id: "g1",
      src: "/gallery/g1-idol-closeup.svg",
      alt: "Close-up of the Durga idol",
      categories: ["idol"],
      ratio: 0.72,
    },
    {
      id: "g2",
      src: "/gallery/g2-pandal-arch.svg",
      alt: "Pandal entrance archway",
      categories: ["pandal"],
      ratio: 1.25,
    },
    {
      id: "g3",
      src: "/gallery/g3-pandal-night.svg",
      alt: "Illuminated pandal at night",
      categories: ["pandal", "culture"],
      ratio: 1.7,
    },
    {
      id: "g4",
      src: "/gallery/g4-idol-detail.svg",
      alt: "Idol ornamentation detail",
      categories: ["idol"],
      ratio: 1.25,
    },
    {
      id: "g5",
      src: "/gallery/g5-fireworks.svg",
      alt: "Fireworks over the pandal",
      categories: ["culture"],
      ratio: 1.25,
    },
    {
      id: "g6",
      src: "/gallery/g6-culture-stage.svg",
      alt: "Cultural evening performance",
      categories: ["culture"],
      ratio: 1.25,
    },
    {
      id: "g7",
      src: "/gallery/g7-drone-aerial.svg",
      alt: "Aerial drone view of the pandal",
      categories: ["drone"],
      ratio: 0.72,
    },
    {
      id: "g8",
      src: "/gallery/g8-interior-corridor.svg",
      alt: "Pandal interior corridor",
      categories: ["pandal"],
      ratio: 0.72,
    },
    {
      id: "g9",
      src: "/gallery/g3-pandal-night.svg",
      alt: "Highlights reel from last year's puja",
      categories: ["culture", "videos"],
      ratio: 1.25,
      isVideo: true,
      videoUrl: null,
    },
  ],
  viewAll: { label: "View All Gallery", href: "/gallery" },
};

// Server-only: the "gallery" content block, with a real Instagram poster
// image resolved (and cached, see getInstagramThumbnail) for any video item
// that's an Instagram link with no manually uploaded photo -- YouTube
// thumbnails are a plain URL Gallery.jsx can build client-side with no
// fetch, but Instagram's needs a server-side scrape, so it has to happen
// here, before the content reaches that client component. Call this
// instead of `getContent("gallery")` wherever the gallery section is
// rendered (currently the homepage and the Gallery page). A failed scrape
// (Instagram changed something, or started blocking this) just leaves that
// item's `src` unset -- Gallery.jsx already falls back to a plain
// placeholder tile for that case, same as before this existed.
export async function getGalleryContent() {
  const content = await getContent("gallery");
  const images = await Promise.all(
    content.images.map(async (image) => {
      if (image.isVideo && !image.src && getInstagramEmbedUrl(image.videoUrl)) {
        const thumbnail = await getInstagramThumbnail(image.videoUrl);
        if (thumbnail) return { ...image, src: thumbnail };
      }
      return image;
    })
  );
  return { ...content, images };
}

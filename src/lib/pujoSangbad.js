import { getContent } from "@/lib/getContent";
import { getInstagramEmbedUrl } from "@/lib/videoEmbeds";
import { getInstagramThumbnail } from "@/lib/instagramThumbnail";

// "Pujo Sangbad" -- news coverage reels/videos about this year's puja,
// pulled in from wherever a news channel posted them (YouTube, Facebook,
// Instagram, or any other link), plus the option to upload a video file
// directly when there's no public post to link to. One shared content
// block (`pujo-sangbad-videos`, see src/lib/admin/sections.js), same
// reasoning as Gallery/Puja Schedule: it gets its own top-level admin nav
// item (not nested under Pages) because it's a growing collection, not
// one page's own static content, and the homepage's "Puja Spotlight"
// teaser (src/components/home/PujaSpotlight.jsx) reads the same list
// (capped to 6) so an admin only ever adds a video once.
//
// Per video:
//   - `videoUrl`: any YouTube/Facebook/Instagram link (see
//     src/lib/videoEmbeds.js for exactly which URL shapes are recognized)
//     or a direct video file URL.
//   - `uploadedVideo`: a video file uploaded straight to this site's own
//     storage instead of linking out -- admin-only, shown with a storage-
//     usage warning in the admin form (see VideoUploadField.jsx), and takes
//     priority over `videoUrl` when both are set.
//   - `src`: the poster/thumbnail shown in the grid. Optional for a
//     YouTube link (auto-derived, see getYoutubeThumbnail) -- otherwise an
//     admin uploads one, same as Gallery's video items.
export const pujoSangbadBanner = {
  title: "Pujo Sangbad",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Pujo Sangbad", href: "/pujo-sangbad" },
  ],
  backgroundImage: null,
};

export const pujoSangbadContent = {
  eyebrow: "Pujo Sangbad",
  description:
    "Durga Pujo as it's being covered right now -- news features, live reports, and reels from the channels following this year's celebration.",
  videos: [
    {
      id: "pv1",
      title: "Telipukur's Pujo Prep Featured on Zee 24 Ghanta",
      source: "Zee 24 Ghanta",
      videoUrl: null,
      uploadedVideo: null,
      src: null,
      alt: "Zee 24 Ghanta news coverage thumbnail",
    },
    {
      id: "pv2",
      title: "RJ Praveen Visits the Pandal",
      source: "Radio City",
      videoUrl: null,
      uploadedVideo: null,
      src: null,
      alt: "Radio City reel thumbnail",
    },
    {
      id: "pv3",
      title: "Opening Night Highlights",
      source: "Local News Network",
      videoUrl: null,
      uploadedVideo: null,
      src: null,
      alt: "Opening night news reel thumbnail",
    },
  ],
};

// Homepage's "Puja Spotlight" section (src/components/home/PujaSpotlight.jsx)
// -- presentation only; the videos themselves are the shared list above.
// `backgroundImage` is this section's own, separate from the Pujo Sangbad
// page's banner, so an admin can give the homepage teaser a different photo
// (or none, falling back to the site's ambient gradient).
export const pujaSpotlightContent = {
  eyebrow: "Puja Spotlight",
  viewAllHref: "/pujo-sangbad",
  backgroundImage: null,
};

// Server-only: the "pujo-sangbad-videos" content block, with a real
// Instagram poster image resolved (and cached, see getInstagramThumbnail)
// for any video that's an Instagram link with no manually uploaded photo --
// same reasoning, and the same helper, as Gallery's getGalleryContent
// (src/lib/gallery.js). YouTube's thumbnail is a plain URL VideoReelGrid.jsx
// builds client-side with no fetch; Facebook's grid-tile preview is its own
// live (paused) embed, also handled client-side in VideoReelGrid.jsx --
// Instagram is the one platform that needs a server-side scrape, so it has
// to happen here, before the content reaches that client component. Call
// this instead of `getContent("pujo-sangbad-videos")` wherever this list is
// rendered (currently the homepage and the Pujo Sangbad page).
export async function getPujoSangbadContent() {
  const content = await getContent("pujo-sangbad-videos");
  const videos = await Promise.all(
    content.videos.map(async (video) => {
      if (video.src || video.uploadedVideo) return video;
      if (!getInstagramEmbedUrl(video.videoUrl)) return video;
      const thumbnail = await getInstagramThumbnail(video.videoUrl);
      return thumbnail ? { ...video, src: thumbnail } : video;
    })
  );
  return { ...content, videos };
}

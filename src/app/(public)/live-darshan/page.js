import PageBanner from "@/components/ui/PageBanner";
import LiveDarshanShowcase from "@/components/live-darshan/LiveDarshanShowcase";
import { getContent } from "@/lib/getContent";
import { getPublishedLiveVideos } from "@/lib/liveVideos";

export const metadata = { title: "Live Darshan" };

export default async function LiveDarshanPage() {
  // "live-darshan" is the same content block the homepage section edits, so
  // both places stay in sync from one admin screen. The video list itself
  // comes from the Live Darshan collection (src/lib/liveVideos.js).
  const [banner, liveDarshan, videos] = await Promise.all([
    getContent("live-darshan-banner"),
    getContent("live-darshan"),
    getPublishedLiveVideos(),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <LiveDarshanShowcase content={liveDarshan} videos={videos} />
    </>
  );
}

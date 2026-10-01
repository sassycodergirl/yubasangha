import PageBanner from "@/components/ui/PageBanner";
import VideoReelGrid from "@/components/pujo-sangbad/VideoReelGrid";
import { getContent } from "@/lib/getContent";
import { getPujoSangbadContent } from "@/lib/pujoSangbad";

export const metadata = { title: "Pujo Sangbad" };

export default async function PujoSangbadPage() {
  // "pujo-sangbad-videos" is the same content block the homepage's Puja
  // Spotlight section reads (capped to 6 there), so an admin only ever adds
  // a video once.
  const [banner, content] = await Promise.all([
    getContent("pujo-sangbad-banner"),
    getPujoSangbadContent(),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <section className="relative overflow-hidden bg-[#d3d1d1] py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10 lg:px-16">
          <p className="text-[11px] uppercase tracking-[0.35em] text-maroon">{content.eyebrow}</p>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink/70">
            {content.description}
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
          <VideoReelGrid videos={content.videos} light />
        </div>
      </section>
    </>
  );
}

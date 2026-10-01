import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import GhostButton from "@/components/ui/GhostButton";
import { ArrowRightIcon } from "@/components/ui/icons";
import VideoReelGrid from "@/components/pujo-sangbad/VideoReelGrid";

// Homepage's "Puja Spotlight" section, right after Gallery -- a teaser for
// Pujo Sangbad's news reels/videos (src/lib/pujoSangbad.js), capped to 6 (a
// clean two full rows of 3, matching VideoReelGrid's lg:grid-cols-3) so the
// homepage doesn't turn into the full page. `content.backgroundImage` is
// this section's own (separate from the Pujo Sangbad page's banner) --
// admin-editable like every other section's background, falling back to
// the site's ambient gradient until one's uploaded.
export default function PujaSpotlight({ content, videos }) {
  const { eyebrow, viewAllHref, backgroundImage } = content;
  const featured = videos.slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <SectionBackground image={backgroundImage} />
      <SectionBlend />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex items-center justify-center gap-5">
          <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
          <p className="text-center font-display text-2xl font-bold uppercase tracking-[0.15em] text-gold sm:text-3xl">
            {eyebrow}
          </p>
          <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
        </div>

        <div className="mt-12">
          <VideoReelGrid videos={featured} />
        </div>

        <div className="mt-10 flex justify-center">
          <GhostButton href={viewAllHref}>
            View All Coverage
            <ArrowRightIcon className="size-4" />
          </GhostButton>
        </div>
      </div>
    </section>
  );
}

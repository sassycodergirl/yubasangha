import PageBanner from "@/components/ui/PageBanner";
import AboutIntro from "@/components/about-us/AboutIntro";
import About from "@/components/home/About";
import AboutTimelineFull from "@/components/about-us/AboutTimelineFull";
import { getContent } from "@/lib/getContent";

export const metadata = { title: "About Us" };

export default async function AboutUsPage() {
  // "about" is the same content block the homepage section edits, so both
  // places stay in sync from one admin screen.
  const [banner, intro, about] = await Promise.all([
    getContent("about-us-banner"),
    getContent("about-intro"),
    getContent("about"),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <AboutIntro content={intro} />
      {/* Photo collage instead of the homepage's milestone timeline -- the
          full timeline gets its own dedicated section right after. No CTA
          here either -- "Our Journey" just links to this same page. */}
      <About content={about} showTimeline={false} showCta={false} />
      <AboutTimelineFull milestones={about.timeline} values={about.values} />
    </>
  );
}

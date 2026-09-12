import PageBanner from "@/components/ui/PageBanner";
import ThemeStory from "@/components/theme-2026/ThemeStory";
import ArtistSpotlight from "@/components/theme-2026/ArtistSpotlight";
import Theme from "@/components/home/Theme";
import { getContent } from "@/lib/getContent";

export const metadata = { title: "Theme 2026" };

export default async function Theme2026Page() {
  // "theme" is the same content block the homepage section edits (its
  // gallery in particular), so both places stay in sync from one admin screen.
  const [banner, story, artist, theme] = await Promise.all([
    getContent("theme-banner"),
    getContent("theme-story"),
    getContent("theme-artist"),
    getContent("theme"),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <ThemeStory content={story} />
      <ArtistSpotlight content={artist} />
      <Theme content={theme} showIntro={false} galleryLayout="grid" />
    </>
  );
}

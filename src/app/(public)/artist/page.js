import PageBanner from "@/components/ui/PageBanner";
import ArtistSpotlight from "@/components/theme-2026/ArtistSpotlight";
import ArtistProcess from "@/components/artist/ArtistProcess";
import { getContent } from "@/lib/getContent";

export const metadata = { title: "Meet the Artist" };

export default async function ArtistPage() {
  // "theme-artist" is the same content block the Theme 2026 page (and the
  // homepage's Theme section) link out to, so all three places stay in sync
  // from one admin screen.
  const [banner, artist, process] = await Promise.all([
    getContent("artist-banner"),
    getContent("theme-artist"),
    getContent("artist-process"),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <ArtistSpotlight content={artist} showProfileLink={false} />
      <ArtistProcess content={process} />
    </>
  );
}

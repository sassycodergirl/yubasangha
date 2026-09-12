import PageBanner from "@/components/ui/PageBanner";
import SponsorsShowcase from "@/components/sponsors/SponsorsShowcase";
import { getContent } from "@/lib/getContent";

export const metadata = { title: "Sponsors" };

export default async function SponsorsPage() {
  // "sponsors" is the same content block the homepage section edits, so
  // both places stay in sync from one admin screen.
  const [banner, sponsors] = await Promise.all([
    getContent("sponsors-banner"),
    getContent("sponsors"),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <SponsorsShowcase sponsors={sponsors.sponsors} />
    </>
  );
}

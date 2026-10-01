import PageBanner from "@/components/ui/PageBanner";
import Gallery from "@/components/home/Gallery";
import { getContent } from "@/lib/getContent";
import { getGalleryContent } from "@/lib/gallery";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  // "gallery" is the same content block the homepage section edits, so both
  // places stay in sync from one admin screen.
  const [banner, gallery] = await Promise.all([
    getContent("gallery-banner"),
    getGalleryContent(),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <Gallery content={gallery} light />
    </>
  );
}

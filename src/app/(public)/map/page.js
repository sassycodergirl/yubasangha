import PageBanner from "@/components/ui/PageBanner";
import PandalMapExplorer from "@/components/map/PandalMapExplorer";
import { getContent } from "@/lib/getContent";

export const metadata = { title: "Map" };

export default async function MapPage() {
  // "map" is the same content block the homepage section edits, so both
  // places stay in sync from one admin screen.
  const [banner, map] = await Promise.all([
    getContent("map-banner"),
    getContent("map"),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <PandalMapExplorer content={map} />
    </>
  );
}

import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Theme from "@/components/home/Theme";
import ArtistSpotlight from "@/components/theme-2026/ArtistSpotlight";
import FestivalCountdown from "@/components/home/FestivalCountdown";
import PujaSchedule from "@/components/home/PujaSchedule";
import Gallery from "@/components/home/Gallery";
import PujaSpotlight from "@/components/home/PujaSpotlight";
import LiveDarshan from "@/components/home/LiveDarshan";
import PandalMap from "@/components/home/PandalMap";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import Sponsors from "@/components/home/Sponsors";
import { getContent } from "@/lib/getContent";
import { getGalleryContent } from "@/lib/gallery";
import { getPujoSangbadContent } from "@/lib/pujoSangbad";
import { getFeaturedEvent } from "@/lib/events";
import { getFeaturedLiveVideo } from "@/lib/liveVideos";

export default async function HomePage() {
  const [
    hero,
    about,
    theme,
    artist,
    countdown,
    schedule,
    scheduleEvents,
    gallery,
    pujaSpotlight,
    pujoSangbad,
    liveDarshan,
    map,
    events,
    sponsors,
    featuredEvent,
    featuredVideo,
  ] = await Promise.all([
    getContent("hero"),
    getContent("about"),
    getContent("theme"),
    getContent("theme-artist"),
    getContent("countdown"),
    getContent("schedule"),
    getContent("schedule-events"),
    getGalleryContent(),
    getContent("puja-spotlight"),
    getPujoSangbadContent(),
    getContent("live-darshan"),
    getContent("map"),
    getContent("events"),
    getContent("sponsors"),
    getFeaturedEvent(),
    getFeaturedLiveVideo(),
  ]);

  return (
    <>
      <Hero content={hero} />
      <About content={about} />
      <Theme content={theme} />
      <ArtistSpotlight content={artist} />
      <FestivalCountdown content={countdown} />
      <PujaSchedule content={schedule} days={scheduleEvents.days} />
      <Gallery content={gallery} maxRows={2} maxVideos={3} />
      <PujaSpotlight content={pujaSpotlight} videos={pujoSangbad.videos} />
      <LiveDarshan content={liveDarshan} youtubeVideoId={featuredVideo?.youtubeVideoId ?? null} />
      <PandalMap content={map} />
      <UpcomingEvents content={events} event={featuredEvent} />
      <Sponsors content={sponsors} />
    </>
  );
}

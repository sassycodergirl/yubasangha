import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Theme from "@/components/home/Theme";
import FestivalCountdown from "@/components/home/FestivalCountdown";
import PujaSchedule from "@/components/home/PujaSchedule";
import Gallery from "@/components/home/Gallery";
import LiveDarshan from "@/components/home/LiveDarshan";
import PandalMap from "@/components/home/PandalMap";
import EventsSponsors from "@/components/home/EventsSponsors";
import { getContent } from "@/lib/getContent";
import { getFeaturedEvent } from "@/lib/events";
import { getFeaturedLiveVideo } from "@/lib/liveVideos";

export default async function HomePage() {
  const [
    hero,
    about,
    theme,
    countdown,
    schedule,
    scheduleEvents,
    gallery,
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
    getContent("countdown"),
    getContent("schedule"),
    getContent("schedule-events"),
    getContent("gallery"),
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
      <FestivalCountdown content={countdown} />
      <PujaSchedule content={schedule} events={scheduleEvents.events} />
      <Gallery content={gallery} maxRows={2} />
      <LiveDarshan content={liveDarshan} youtubeVideoId={featuredVideo?.youtubeVideoId ?? null} />
      <PandalMap content={map} />
      <EventsSponsors events={events} event={featuredEvent} sponsors={sponsors} />
    </>
  );
}

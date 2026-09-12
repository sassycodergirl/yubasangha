import PageBanner from "@/components/ui/PageBanner";
import EventsShowcase from "@/components/events/EventsShowcase";
import { getContent } from "@/lib/getContent";
import { getPublishedEvents } from "@/lib/events";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const [banner, events] = await Promise.all([
    getContent("events-banner"),
    getPublishedEvents(),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <EventsShowcase events={events} />
    </>
  );
}

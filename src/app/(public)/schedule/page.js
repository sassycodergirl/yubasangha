import PageBanner from "@/components/ui/PageBanner";
import ScheduleTimeline from "@/components/schedule/ScheduleTimeline";
import { getContent } from "@/lib/getContent";

export const metadata = { title: "Puja Schedule" };

export default async function SchedulePage() {
  const [banner, timeline, scheduleEvents] = await Promise.all([
    getContent("schedule-banner"),
    getContent("schedule-timeline"),
    getContent("schedule-events"),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <ScheduleTimeline content={timeline} events={scheduleEvents.events} />
    </>
  );
}

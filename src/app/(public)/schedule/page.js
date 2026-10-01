import PageBanner from "@/components/ui/PageBanner";
import ScheduleIntro from "@/components/schedule/ScheduleIntro";
import PujaSchedule from "@/components/home/PujaSchedule";
import { getContent } from "@/lib/getContent";

export const metadata = { title: "Puja Schedule" };

export default async function SchedulePage() {
  // "schedule-events" (the day-card grid) is the same content block the
  // homepage's own Puja Schedule section edits, so both places stay in sync
  // from one admin screen -- see PujaSchedule.jsx.
  const [banner, intro, schedule, scheduleEvents] = await Promise.all([
    getContent("schedule-banner"),
    getContent("schedule-timeline"),
    getContent("schedule"),
    getContent("schedule-events"),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <ScheduleIntro content={intro} />
      <PujaSchedule
        content={schedule}
        days={scheduleEvents.days}
        showHeading={false}
        showCta={false}
        topBlendFrom="#d3d1d1"
      />
    </>
  );
}

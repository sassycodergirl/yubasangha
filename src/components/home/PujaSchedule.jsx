import { Fragment } from "react";
import SectionBackground from "@/components/ui/SectionBackground";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import GhostButton from "@/components/ui/GhostButton";
import {
  ArrowRightIcon,
  DiyaIcon,
  FlowerIcon,
  BhogIcon,
  TempleIcon,
  MusicIcon,
  DhunuchiIcon,
  ImmersionIcon,
} from "@/components/ui/icons";

// Maps the `icon` key stored per event (src/lib/schedule.js) to its glyph --
// keeps content data serializable (a plain string) instead of storing a
// component reference, which matters once this becomes admin-editable.
const ICONS = {
  aroti: DiyaIcon,
  flower: FlowerIcon,
  bhog: BhogIcon,
  temple: TempleIcon,
  dance: MusicIcon,
  drum: DhunuchiIcon,
  immersion: ImmersionIcon,
};

function EventBadge({ event }) {
  const Icon = ICONS[event.icon] ?? DiyaIcon;
  return (
    // Wrapper width matches the circle exactly (no extra side padding) so a
    // connector reaches all the way to its edge instead of stopping short
    // of it.
    <div className="relative flex w-20 shrink-0 snap-start flex-col items-center gap-2.5 sm:w-24">
      <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-gold  sm:size-24">
        <span className="absolute inset-1 rounded-full border border-gold/40 bg-gradient-to-b from-maroon to-maroon-dark shadow-[0_0_22px_-6px_rgba(201,154,59,0.55)]" />
        <Icon className="z-50 size-7 text-gold sm:size-8" />
      </div>
      <div className="text-center">
        <p className="font-display text-xs font-semibold text-gold sm:text-sm">{event.time}</p>
        <p className="mt-0.5 font-display text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
          {event.label}
        </p>
      </div>
    </div>
  );
}

export default function PujaSchedule({ content, events }) {
  const { eyebrow, cta, backgroundImage } = content;

  return (
    <section className="relative overflow-hidden bg-[#6e7266] py-16 text-white sm:py-20">
      <SectionBackground image={backgroundImage} fallback="none" />
     
     

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex items-center justify-center gap-5">
          <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
          <p className="text-center font-display text-2xl font-bold uppercase tracking-[0.15em] text-gold sm:text-3xl">
            {eyebrow}
          </p>
          <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
        </div>

        {/* Horizontal at every size -- swipeable on phones (fixed-width
            connectors, so it scrolls cleanly), and on sm+ the connectors
            grow to fill the row so the badges spread across the full
            section width instead of clustering in the center. The
            connecting line is a real segment between each pair of badges
            (not one full-width bar behind everything), so it only ever
            runs from the first badge to the last -- never past either
            edge. */}
        <div className="mt-10 flex snap-x snap-mandatory items-start justify-start overflow-x-auto px-1 pb-2">
          {events.map((event, i) => (
            <Fragment key={event.label}>
              {i > 0 && (
                <span className="relative mt-10 flex w-6 shrink-0 items-center sm:mt-12 sm:w-auto sm:min-w-8 sm:max-w-24 sm:flex-1">
                  <span className="h-px w-full rounded-full bg-gold " />
                  <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                </span>
              )}
              <EventBadge event={event} />
            </Fragment>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <GhostButton href={cta.href}>
            {cta.label}
            <ArrowRightIcon className="size-4" />
          </GhostButton>
        </div>
      </div>
    </section>
  );
}

import SectionBackground from "@/components/ui/SectionBackground";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import GhostButton from "@/components/ui/GhostButton";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getDateLabel } from "@/lib/dateFormat";

// Ticket-style date badge -- same "stub" language as the event date stubs
// elsewhere on the site (UpcomingEvents, EventsShowcase), just compact
// enough for a schedule card: a dark day/month block fused to a lighter
// weekday block, instead of the plain highlighted-text treatment this
// replaced (which read as a stray label, not something that stood out).
function DateBadge({ date }) {
  const { day, month } = getDateLabel(date);
  const weekday = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="flex overflow-hidden rounded-lg shadow-md ring-1 ring-maroon/15">
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-maroon to-maroon-dark px-3.5 py-1.5 text-white">
        <span className="font-display text-lg font-bold leading-none">{day}</span>
        <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-gold-soft">
          {month}
        </span>
      </div>
      <div className="flex items-center bg-gold/15 px-3 text-[11px] font-bold uppercase tracking-wide text-maroon">
        {weekday}
      </div>
    </div>
  );
}

// Each day's `items` are free text (see src/lib/scheduleEvents.js) -- an
// admin just types a line, no separate "label"/"time" fields to fill in.
// Most will still naturally write "Ritual name — time" (an em or hyphen
// dash), so that shape still gets a bold lead-in + muted time for the
// familiar schedule-row look; anything else (a plain note, a sentence with
// no dash) just renders as-is instead of being forced into that shape.
function ItemText({ text }) {
  const match = text.match(/^(.+?)\s+[—-]\s+(.+)$/);
  if (!match) return <span>{text}</span>;
  const [, label, rest] = match;
  return (
    <span>
      <span className="font-semibold text-ink">{label}</span>
      <span className="text-ink/60"> — {rest}</span>
    </span>
  );
}

function DayCard({ day }) {
  return (
    <div className="relative flex h-full flex-col rounded-2xl bg-[#f8f2e4] px-5 pb-6 pt-9 text-center shadow-lg ring-1 ring-maroon/10 before:pointer-events-none before:absolute before:inset-[7px] before:rounded-xl before:border before:border-gold/50 before:content-['']">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-gold/60 bg-maroon px-5 py-1.5 shadow-md">
        <p className="whitespace-nowrap font-display text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
          {day.title}
        </p>
      </div>

      <div className="relative mt-3 flex justify-center">
        <DateBadge date={day.date} />
      </div>

      <span className="relative mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <ul className="relative mt-4 space-y-2 text-left text-sm text-ink/75">
        {day.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-gold" />
            <ItemText text={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Homepage's "Puja Schedule / Nirghnoto" section -- the day-by-day ritual
// calendar, one card per day. `days` is the shared "schedule-events" content
// block (src/lib/scheduleEvents.js), edited once from either this section's
// admin screen or the Schedule page's. Also reused directly on the Schedule
// page itself (same pattern as Theme.jsx on /theme-2026) -- `showHeading`/
// `showCta` turn off this section's own eyebrow and "View Full Schedule"
// button there, since that page already has its own banner + intro text and
// linking to itself would be redundant.
export default function PujaSchedule({ content, days, showHeading = true, showCta = true, topBlendFrom = null }) {
  const { eyebrow, cta, backgroundImage } = content;

  return (
    <section className="relative overflow-hidden bg-[#6e7266] py-16 text-white sm:py-20">
      <SectionBackground image={backgroundImage} fallback="none" />
      {/* Only passed on the Schedule page, where this section follows
          ScheduleIntro's light #d3d1d1 background directly -- without it,
          that light section cutting straight to this dark one reads as a
          hard, slightly jarring seam instead of a page that flows. The
          homepage doesn't pass this: FestivalCountdown (already dark) sits
          above it there, so there's nothing to blend from. */}
      {topBlendFrom ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20 sm:h-28"
          style={{ background: `linear-gradient(to bottom, ${topBlendFrom}, transparent)` }}
        />
      ) : null}

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
        {showHeading ? (
          <div className="flex items-center justify-center gap-5">
            <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
            <p className="text-center font-display text-2xl font-bold uppercase tracking-[0.15em] text-gold sm:text-3xl">
              {eyebrow}
            </p>
            <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
          </div>
        ) : null}

        <div className={`grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 ${showHeading ? "mt-12" : ""}`}>
          {days.map((day, i) => (
            <DayCard key={`${day.title}-${i}`} day={day} />
          ))}
        </div>

        {showCta ? (
          <div className="mt-12 flex justify-center">
            <GhostButton href={cta.href}>
              {cta.label}
              <ArrowRightIcon className="size-4" />
            </GhostButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}

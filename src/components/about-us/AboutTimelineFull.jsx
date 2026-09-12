import Image from "next/image";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import { DiyaIcon, ImageIcon } from "@/components/ui/icons";

const YEAR_GLOW = {
  textShadow: "0 0 10px rgba(201,154,59,0.7), 0 0 24px rgba(201,154,59,0.4)",
};

function MilestoneCard({ milestone, reverse }) {
  return (
    <div
      className={`flex flex-col gap-5 ${
        reverse ? "sm:items-end sm:text-right" : "sm:items-start sm:text-left"
      }`}
    >
      <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-lg border-2 border-gold/70 bg-ink-soft shadow-2xl">
        {milestone.image ? (
          <Image
            src={milestone.image}
            alt={milestone.title}
            fill
            unoptimized
            sizes="(min-width: 640px) 20rem, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
            <ImageIcon className="size-8 text-gold/60" />
          </div>
        )}
      </div>
      <div className="min-w-0 max-w-xs">
        <p className="font-display text-3xl font-bold text-gold" style={YEAR_GLOW}>
          {milestone.year}
        </p>
        <p className="mt-1 font-display text-lg font-bold uppercase tracking-wide text-white">
          {milestone.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{milestone.description}</p>
      </div>
    </div>
  );
}

// About Us page's own dedicated milestone section -- every entry laid out
// and visible at once on a zigzag vertical timeline (alternating sides on
// desktop, one connected column on mobile), instead of the homepage's
// one-card-at-a-time coverflow slider (see AboutTimeline). Reuses the same
// `timeline`/`values` data the homepage section edits.
export default function AboutTimelineFull({ milestones, values }) {
  return (
    <section className="relative overflow-hidden bg-ink-soft py-20 text-white sm:py-28">
      <SectionBackground image={null} fallback="none" />
      

      <div className="relative mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Our Journey</p>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
            Milestones Through
            <span className="block text-gold-soft">the Years</span>
          </h2>
        </div>

        <div className="relative mt-16">
          {/* Connecting line: left edge on mobile (a plain vertical list),
              centered on desktop (where cards alternate sides). */}
          <div className="pointer-events-none absolute left-5 top-0 h-full w-px bg-gold/25 sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-16 sm:space-y-6">
            {milestones.map((milestone, i) => {
              const onRight = i % 2 === 1;
              return (
                <div
                  key={milestone.year}
                  className="relative pl-14 sm:grid sm:min-h-56 sm:grid-cols-2 sm:items-center sm:gap-x-16 sm:pl-0"
                >
                  <span className="absolute left-5 top-2 size-3 -translate-x-1/2 rounded-full border-2 border-gold bg-ink-soft sm:left-1/2 sm:top-1/2 sm:-translate-y-1/2" />
                  <div className={onRight ? "sm:col-start-2" : "sm:col-start-1"}>
                    <MilestoneCard milestone={milestone} reverse={!onRight} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {values?.length ? (
          <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
            {values.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold"
              >
                <DiyaIcon className="size-3.5" />
                {word}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

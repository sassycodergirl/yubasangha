"use client";

import { useEffect, useState } from "react";
import SectionBackground from "@/components/ui/SectionBackground";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import CornerFrame from "@/components/ui/CornerFrame";
import { DiyaIcon } from "@/components/ui/icons";

// Two-layer glow so the count reads as the focal point of each card.
const NUMBER_GLOW = {
  textShadow: "0 0 14px rgba(201,154,59,0.65), 0 0 34px rgba(201,154,59,0.35)",
};

function daysUntil(dateStr) {
  const target = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = target - startOfToday;
  return Math.ceil(diff / 86400000);
}

function OccasionCard({ occasion, days }) {
  const { label, dateLabel, featured } = occasion;
  // `days` is the raw (unclamped) day count -- negative once that occasion's
  // date is behind "today", so the card can fade out instead of sitting at a
  // misleading "0 days" forever.
  const isPast = days !== null && days < 0;
  const displayDays = days === null ? null : Math.max(0, days);

  if (featured) {
    return (
      <div
        className={`relative flex w-[126px] shrink-0 snap-start flex-col items-center rounded-lg bg-gradient-to-b from-maroon to-maroon-dark px-4 pb-5 pt-8 shadow-[0_0_30px_-8px_rgba(201,154,59,0.45)] transition-[filter,opacity] duration-500 sm:w-auto sm:flex-1 sm:shrink sm:basis-0 ${
          isPast ? "opacity-40 saturate-0 blur-[1.5px]" : ""
        }`}
      >
        {isPast ? (
          <span className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center text-[9px] font-semibold uppercase tracking-[0.25em] text-white/80">
            Passed
          </span>
        ) : null}
        <CornerFrame />
        <span className="absolute -top-4 flex size-8 items-center justify-center rounded-full border border-gold bg-ink">
          <DiyaIcon className="size-4 text-gold" />
        </span>
        <p className="text-center font-display text-sm font-bold uppercase tracking-wide text-white sm:text-base">
          {label}
        </p>
        <p className="mt-0.5 text-center text-[10px] uppercase tracking-wide text-white/60 sm:text-xs">
          {dateLabel}
        </p>
        <p
          className="mt-2 font-display text-4xl font-bold leading-none text-gold-soft sm:text-5xl"
          style={NUMBER_GLOW}
        >
          {displayDays === null ? "--" : displayDays}
        </p>
        <p className="mt-1.5 text-center text-[10px] uppercase tracking-[0.2em] text-white/70 sm:text-xs">
          Days
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative flex w-[106px] shrink-0 snap-start flex-col items-center rounded-lg border border-gold/40 bg-white/[0.03] px-3 pb-5 pt-7 transition-[filter,opacity] duration-500 sm:w-auto sm:flex-1 sm:shrink sm:basis-0 ${
        isPast ? "opacity-40 saturate-0 blur-[1.5px]" : ""
      }`}
    >
      {isPast ? (
        <span className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center text-[9px] font-semibold uppercase tracking-[0.25em] text-white/70">
          Passed
        </span>
      ) : null}
      <CornerFrame tone="border-gold/70" />
      <p className="text-center font-display text-sm font-semibold uppercase tracking-wide text-white sm:text-base">
        {label}
      </p>
      <p className="mt-0.5 text-center text-[10px] uppercase tracking-wide text-white/50 sm:text-xs">
        {dateLabel}
      </p>
      <p
        className="mt-2 font-display text-3xl font-bold leading-none text-gold-soft sm:text-4xl"
        style={NUMBER_GLOW}
      >
        {displayDays === null ? "--" : displayDays}
      </p>
      <p className="mt-1.5 text-center text-[10px] uppercase tracking-[0.2em] text-white/60 sm:text-xs">
        Days
      </p>
    </div>
  );
}

export default function FestivalCountdown({ content }) {
  const { eyebrow, occasions, backgroundImage } = content;

  // Compute after mount so the server-rendered markup and first client
  // render match (day counts depend on the viewer's local "today"); a
  // minute is plenty of granularity for a days-only countdown to stay live.
  const [days, setDays] = useState(null);

  useEffect(() => {
    const update = () => setDays(occasions.map((o) => daysUntil(o.date)));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- occasions is static config
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <SectionBackground image={backgroundImage} />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex items-center justify-center gap-5">
          <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
          <p className="text-center font-display text-2xl font-bold uppercase tracking-[0.15em] text-gold sm:text-3xl">
            {eyebrow}
          </p>
          <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
        </div>

        {/* Horizontal at every size -- naturally scrollable on phones,
            simply fits without scrolling once there's room on desktop. */}
        <div className="mt-8 flex snap-x snap-mandatory justify-start gap-3 overflow-x-auto px-1 pb-2 sm:gap-5">
          {occasions.map((occasion, i) => (
            <OccasionCard key={occasion.label} occasion={occasion} days={days?.[i] ?? null} />
          ))}
        </div>
      </div>
    </section>
  );
}

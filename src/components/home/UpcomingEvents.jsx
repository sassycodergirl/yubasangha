"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SectionBackground from "@/components/ui/SectionBackground";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import CornerFrame from "@/components/ui/CornerFrame";
import GoldButton from "@/components/ui/GoldButton";
import { ArrowRightIcon, CalendarIcon, ImageIcon } from "@/components/ui/icons";
import { getDateLabel } from "@/lib/dateFormat";

const NUMBER_GLOW = {
  textShadow: "0 0 14px rgba(201,154,59,0.65), 0 0 34px rgba(201,154,59,0.35)",
};

const pad = (n) => String(n).padStart(2, "0");

// Computed after mount so the server-rendered markup and first client render
// match (remaining time depends on the viewer's clock) -- same pattern as
// FestivalCountdown's daysUntil.
function useCountdown(dateStr) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const target = new Date(dateStr).getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      const totalSeconds = Math.floor(diff / 1000);
      setTime({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [dateStr]);

  return time;
}

function CountdownUnit({ label, value }) {
  return (
    <div className="relative flex min-w-16 flex-col items-center rounded-lg border border-gold/40 bg-white/[0.03] px-3 py-2.5 sm:min-w-20 sm:py-3">
      <CornerFrame tone="border-gold/50" />
      <span className="font-display text-2xl font-bold leading-none text-gold-soft sm:text-3xl" style={NUMBER_GLOW}>
        {value}
      </span>
      <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/50 sm:text-[10px]">{label}</span>
    </div>
  );
}

function FeaturedEventCard({ event }) {
  const t = useCountdown(event.date);
  const dateLabel = getDateLabel(event.date);
  const units = [
    { label: "Days", value: t?.days },
    { label: "Hrs", value: t?.hours },
    { label: "Mins", value: t?.minutes },
    { label: "Secs", value: t?.seconds },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-white/[0.03] p-6 shadow-2xl sm:p-8">
      <div className="grid gap-8 md:grid-cols-[1fr_1.15fr] md:items-center md:gap-10">
        {/* Photo */}
        <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border-2 border-gold/60 shadow-xl">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              unoptimized
              sizes="(min-width: 768px) 420px, 90vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
              <ImageIcon className="size-10 text-gold/60" />
            </div>
          )}
          <CornerFrame />
          {/* Date flag */}
          <div className="absolute left-4 top-4 flex flex-col items-center rounded-lg bg-maroon/90 px-3 py-2 text-white shadow-lg backdrop-blur-sm">
            <span className="font-display text-xl font-bold leading-none">{dateLabel.day}</span>
            <span className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-gold-soft">{dateLabel.month}</span>
          </div>
        </div>

        {/* Details */}
        <div className="min-w-0 text-center md:text-left">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{event.category}</p>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-white sm:text-3xl">
            {event.title}
          </h3>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-white/60 md:justify-start">
            <CalendarIcon className="size-4 text-gold" />
            {event.time}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-2.5">
                {i > 0 && <span className="font-display text-xl text-gold/30">:</span>}
                <CountdownUnit label={unit.label} value={t ? pad(unit.value) : "--"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Homepage's "Upcoming Events" teaser -- its own dedicated full-width
// section now (split out of the combined EventsSponsors panel), led by a
// single spacious featured-event card with a prominent live countdown
// instead of the half-width compact version that used to share a row with
// Sponsors. The event itself still comes live from the Events collection
// (src/lib/events.js), not from here -- an admin never enters it twice.
export default function UpcomingEvents({ content, event }) {
  const { eyebrow, viewAllHref, backgroundImage } = content;

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <SectionBackground image={backgroundImage} />
      {/* Taller than the shared SectionBlend's default ~128px -- that was
          fading to the photo too abruptly right where the heading sits,
          reading as a hard seam against the section above instead of a
          gentle transition. The photo itself stays fully visible further
          down; this only stretches out how gradually it's revealed. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent sm:h-64" />

      <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-center gap-5">
          <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
          <p className="text-center font-display text-2xl font-bold uppercase tracking-[0.15em] text-gold sm:text-3xl">
            {eyebrow}
          </p>
          <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
        </div>

        <div className="mt-10">
          {event ? (
            <FeaturedEventCard event={event} />
          ) : (
            <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-white/50">
              No upcoming events yet.
            </p>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <GoldButton href={viewAllHref}>
            View All Events
            <ArrowRightIcon className="size-4" />
          </GoldButton>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, ImageIcon } from "@/components/ui/icons";
import { getDateLabel } from "@/lib/dateFormat";

const pad = (n) => String(n).padStart(2, "0");

// Computed after mount so the server-rendered markup and first client
// render match (the remaining time depends on the viewer's clock).
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

function EventCountdown({ date }) {
  const t = useCountdown(date);
  const units = [
    { label: "Days", value: t?.days },
    { label: "Hrs", value: t?.hours },
    { label: "Mins", value: t?.minutes },
    { label: "Secs", value: t?.seconds },
  ];

  return (
    <div className="flex flex-wrap items-end gap-x-1 gap-y-1">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-end gap-1">
          {i > 0 && <span className="pb-1 font-display text-sm text-maroon/40 sm:pb-1.5 sm:text-base">:</span>}
          <div className="flex flex-col items-center">
            <span className="font-display text-base font-bold leading-none text-maroon sm:text-xl">
              {t ? pad(unit.value) : "--"}
            </span>
            <span className="mt-1 text-[7px] uppercase tracking-wide text-ink/50 sm:text-[8px]">
              {unit.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Same ticket-stub card design as the dedicated Events page (see
// EventsShowcase.jsx): a maroon date stub with punched "notches" and a
// dashed tear line beside a photo and the details. The notches are outlined
// rings with a transparent fill (not a solid color) -- this section's
// background isn't a flat color, so no single fill would read as a clean
// cut-out against it. Keeps every detail the homepage teaser had (category,
// title, time, live countdown), just restyled to match.
function EventCard({ event, href }) {
  const dateLabel = getDateLabel(event.date);
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl sm:flex-row"
    >
      {/* Date stub */}
      <div className="relative flex shrink-0 items-center justify-center gap-3 bg-maroon px-6 py-4 text-white sm:w-28 sm:flex-col sm:gap-1 sm:py-6">
        <span className="font-display text-3xl font-bold leading-none">{dateLabel.day}</span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-gold-soft">
          {dateLabel.month}
        </span>
        <span className="pointer-events-none absolute -right-3 top-0 hidden size-6 -translate-y-1/2 rounded-full border border-white/25 bg-transparent sm:block" />
        <span className="pointer-events-none absolute -right-3 bottom-0 hidden size-6 translate-y-1/2 rounded-full border border-white/25 bg-transparent sm:block" />
        <span className="pointer-events-none absolute inset-y-3 right-0 hidden border-r-2 border-dashed border-white/30 sm:block" />
      </div>

      {/* Photo */}
      <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-36">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            unoptimized
            sizes="(min-width: 640px) 150px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
            <ImageIcon className="size-8 text-gold/60" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-center gap-2.5 p-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-maroon">{event.category}</p>
          <h3 className="mt-0.5 font-display text-base font-bold uppercase leading-tight text-ink">
            {event.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ink/60">
          <CalendarIcon className="size-4 text-maroon" />
          {event.time}
        </div>
        <EventCountdown date={event.date} />
      </div>
    </Link>
  );
}

// Genuinely seamless infinite loop: the sponsor list is rendered twice
// back-to-back, and once scroll position passes the halfway point (the
// boundary between the two copies) it's silently reset by exactly one
// copy's width -- since both copies are identical, that reset is
// invisible. Autoplay nudges the scroll every couple of seconds; the
// arrows do the same nudge on demand; both just move native scrollLeft,
// so they compose without fighting each other.
function SponsorCarousel({ sponsors }) {
  const CARD_WIDTH = 182; // 170px card + 12px gap
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const normalizeTimeout = useRef(null);
  const loopItems = [...sponsors, ...sponsors];

  const normalize = useCallback(() => {
    clearTimeout(normalizeTimeout.current);
    normalizeTimeout.current = setTimeout(() => {
      const el = trackRef.current;
      if (!el) return;
      const singleSetWidth = el.scrollWidth / 2;
      if (el.scrollLeft >= singleSetWidth) {
        el.scrollLeft -= singleSetWidth;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += singleSetWidth;
      }
    }, 150);
  }, []);

  const startAutoplay = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      trackRef.current?.scrollBy({ left: CARD_WIDTH, behavior: "smooth" });
    }, 2600);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // Start a quarter of the way into the doubled track (room to scroll
    // either direction before a wrap is needed), snapped to a multiple of
    // CARD_WIDTH -- an un-aligned starting offset would leave every card
    // sitting slightly off-grid for the carousel's whole lifetime, which
    // is exactly what produced that uneven gap between cards.
    el.scrollLeft = Math.round(el.scrollWidth / 4 / CARD_WIDTH) * CARD_WIDTH;
    startAutoplay();
    el.addEventListener("scroll", normalize, { passive: true });
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(normalizeTimeout.current);
      el.removeEventListener("scroll", normalize);
    };
  }, [startAutoplay, normalize]);

  const pause = () => clearInterval(timerRef.current);

  const nudge = (dir) => {
    trackRef.current?.scrollBy({ left: dir * CARD_WIDTH, behavior: "smooth" });
    startAutoplay();
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={pause}
        onMouseLeave={startAutoplay}
        onTouchStart={pause}
        onTouchEnd={startAutoplay}
      >
        {loopItems.map((sponsor, i) => (
          <div
            key={`${sponsor.id}-${i}`}
            className="flex w-[170px] shrink-0 flex-col items-center gap-2.5 rounded-lg border border-gold/20 bg-white px-3 py-5 shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-black">{sponsor.tier}</p>
            <div className="relative h-20 w-full">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                unoptimized
                sizes="150px"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Touch swipe drives it on phones -- arrows are for pointer/keyboard,
          and would otherwise overlap the first/last card on narrow screens. */}
      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Previous sponsor"
        className="absolute left-0 top-1/2 z-10 hidden size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-ink text-gold transition-colors hover:bg-gold/10 sm:flex"
      >
        <ArrowLeftIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Next sponsor"
        className="absolute right-0 top-1/2 z-10 hidden size-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-ink text-gold transition-colors hover:bg-gold/10 sm:flex"
      >
        <ArrowRightIcon className="size-4" />
      </button>
    </div>
  );
}

function PanelHeader({ title, href }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-xl font-bold uppercase tracking-wide text-gold sm:text-2xl">
        {title}
      </h2>
      <Link
        href={href}
        className="rounded-full border border-gold/50 bg-ink/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gold transition-colors hover:border-gold hover:bg-gold/10"
      >
        View All
      </Link>
    </div>
  );
}

export default function EventsSponsors({ events, event, sponsors }) {
  const { eyebrow: eventsEyebrow, viewAllHref: eventsHref, backgroundImage } = events;
  const { eyebrow: sponsorsEyebrow, viewAllHref: sponsorsHref, sponsors: sponsorList } = sponsors;

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <SectionBackground image={backgroundImage} />


      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <PanelHeader title={eventsEyebrow} href={eventsHref} />
            <div className="mt-5">
              {event ? (
                <EventCard event={event} href={eventsHref} />
              ) : (
                <p className="rounded-2xl border border-dashed border-white/20 p-6 text-sm text-white/50">
                  No upcoming events yet.
                </p>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <PanelHeader title={sponsorsEyebrow} href={sponsorsHref} />
            <div className="mt-5">
              <SponsorCarousel sponsors={sponsorList} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

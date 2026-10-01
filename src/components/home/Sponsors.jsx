"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import GhostButton from "@/components/ui/GhostButton";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";

// Genuinely seamless infinite loop: the sponsor list is rendered twice
// back-to-back, and once scroll position passes the halfway point (the
// boundary between the two copies) it's silently reset by exactly one
// copy's width -- since both copies are identical, that reset is invisible.
// Autoplay nudges the scroll every couple of seconds; the arrows do the same
// nudge on demand; both just move native scrollLeft, so they compose
// without fighting each other.
function SponsorCarousel({ sponsors }) {
  const CARD_WIDTH = 212; // 200px card + 12px gap
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
    // sitting slightly off-grid for the carousel's whole lifetime.
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
        className="flex gap-3 overflow-x-auto scroll-smooth px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={pause}
        onMouseLeave={startAutoplay}
        onTouchStart={pause}
        onTouchEnd={startAutoplay}
      >
        {loopItems.map((sponsor, i) => (
          <div
            key={`${sponsor.id}-${i}`}
            className="flex w-[200px] shrink-0 flex-col items-center gap-3 rounded-xl border border-gold/20 bg-white px-5 py-7 shadow-md transition-transform hover:-translate-y-1 hover:shadow-xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-maroon">{sponsor.tier}</p>
            <div className="relative h-24 w-full">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                fill
                unoptimized
                sizes="200px"
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
        className="absolute left-0 top-1/2 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gold/40 bg-ink text-gold transition-colors hover:bg-gold/10 sm:flex"
      >
        <ArrowLeftIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Next sponsor"
        className="absolute right-0 top-1/2 z-10 hidden size-9 translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gold/40 bg-ink text-gold transition-colors hover:bg-gold/10 sm:flex"
      >
        <ArrowRightIcon className="size-4" />
      </button>
    </div>
  );
}

// Homepage's "Our Sponsors" showcase -- its own dedicated full-width section
// now (split out of the combined EventsSponsors panel), with more room for
// the auto-scrolling logo carousel than the half-width column it used to
// share with Upcoming Events. `bg-ink-soft` (vs. Upcoming Events' `bg-ink`
// right above it) is deliberate: the two now stack directly on the page, so
// a tonal shift is what keeps the seam between them reading as two sections
// instead of one long one.
export default function Sponsors({ content }) {
  const { eyebrow, viewAllHref, sponsors } = content;

  return (
    <section className="relative overflow-hidden bg-ink-soft py-16 text-white sm:py-20">
      <SectionBackground image={null} fallback="none" />
      <SectionBlend />

      <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-center gap-5">
          <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
          <p className="text-center font-display text-2xl font-bold uppercase tracking-[0.15em] text-gold sm:text-3xl">
            {eyebrow}
          </p>
          <OrnamentDivider className="hidden h-4 w-16 shrink-0 sm:block" />
        </div>

        <div className="mt-10">
          <SponsorCarousel sponsors={sponsors} />
        </div>

        <div className="mt-8 flex justify-center">
          <GhostButton href={viewAllHref}>
            View All Sponsors
            <ArrowRightIcon className="size-4" />
          </GhostButton>
        </div>
      </div>
    </section>
  );
}

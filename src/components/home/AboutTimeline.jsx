"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { DiyaIcon, ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";

const AUTOPLAY_MS = 4200;
// Every card reserves this much height before its connector, so the dot at
// the end of the connector always lands on the timeline at the same y --
// no matter how different the card's own layout is.
const FIGURE_HEIGHT = "h-72"; // 288px

const YEAR_GLOW = {
  textShadow: "0 0 10px rgba(201,154,59,0.7), 0 0 24px rgba(201,154,59,0.4)",
};

// Fades/slides a card in once, shortly after mount. Deliberately not
// IntersectionObserver-based: these cards live in a horizontally-scrolling
// carousel, and an ancestor with `overflow-x-auto` clips the intersection
// calculation -- a card scrolled off to the side reads as "not intersecting"
// even though the section itself is on screen, so it never revealed until
// manually scrolled to (looked like a lazy-loading blank flash every time).
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return [ref, visible];
}

// Short stalk + dot dropping from a card's figure down onto the timeline --
// shared by every card type so they all connect at the same height.
function Connector() {
  return (
    <div className="flex flex-col items-center">
      <span className="h-6 w-px bg-gold/30" />
      <span className="-mt-1.5 size-3 shrink-0 rounded-full bg-gold ring-4 ring-ink" />
    </div>
  );
}

// The opening milestone (1954): its caption is a plaque overlapping the
// photo's lower-left corner, rather than sitting underneath it.
function FeaturedMilestone({ milestone, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`flex flex-col items-center transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className={`relative ${FIGURE_HEIGHT} w-[70vw] max-w-[260px]`}>
        <div className="absolute inset-0 overflow-hidden rounded-lg border-[1.5px] border-gold bg-ink shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element -- static placeholder asset */}
          <img
            src={milestone.image}
            alt={milestone.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-x-2 bottom-2 rounded-md bg-ink/95 px-3 py-2.5 shadow-lg ring-1 ring-gold/25">
          <p className="font-display text-base font-bold text-gold" style={YEAR_GLOW}>
            {milestone.year}
          </p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            {milestone.title}
          </p>
          <p className="mt-1 text-[10px] leading-snug text-white/60">
            {milestone.description}
          </p>
        </div>
      </div>
      <Connector />
    </div>
  );
}

// Later milestones: photo and story sit side by side in one row.
function MilestoneRow({ milestone, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`flex flex-col items-center transition-all duration-700 ease-out ${
        visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
    >
      <div className={`flex ${FIGURE_HEIGHT} w-[100vw] max-w-[480px] items-center gap-4`}>
        <div className="h-56 w-56 shrink-0 overflow-hidden rounded-lg border-[1.5px] border-gold bg-ink shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element -- static placeholder asset */}
          <img
            src={milestone.image}
            alt={milestone.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="font-display text-lg font-bold text-gold" style={YEAR_GLOW}>
            {milestone.year}
          </p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            {milestone.title}
          </p>
          <p className="mt-1 max-w-[12rem] text-[11px] leading-relaxed text-white/55">
            {milestone.description}
          </p>
        </div>
      </div>
      <Connector />
    </div>
  );
}

function ValuesCard({ values, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`flex flex-col items-center transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className={`flex ${FIGURE_HEIGHT} w-[45vw] max-w-[160px] items-center justify-center`}>
        <div className="flex h-52 w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-gold bg-gradient-to-b from-maroon to-maroon-dark px-3 py-6 shadow-xl">
          <DiyaIcon className="size-8 text-gold" />
          <div className="flex flex-col items-center gap-3">
            {values.map((word) => (
              <p
                key={word}
                className="font-display font-bold text-[11px] uppercase tracking-[0.25em] text-gold"
              >
                {word}
              </p>
            ))}
          </div>
        </div>
      </div>
      <Connector />
    </div>
  );
}

// Timeline slider, used at every screen size: `index` is state *we* own and
// drive -- arrows and autoplay just increment/decrement it (looping at the
// ends) -- and a single effect scrolls the target card into view whenever
// it changes. Deliberately not trying to *detect* the active card from
// scroll position/visibility: that approach kept misfiring once multiple
// narrow cards were partly visible at once. Every card renders at full
// opacity. On phones the arrow buttons hide and touch swipe drives it
// instead (autoplay pauses while a finger is on it); this also means the
// story can grow to any number of milestones without the section turning
// into an endless scroll -- it always stays one card-at-a-time.
function TimelineSlider({ children }) {
  const viewportRef = useRef(null);
  const wrapperRefs = useRef([]);
  const timerRef = useRef(null);
  const [index, setIndex] = useState(0);

  const items = Children.toArray(children);
  const count = items.length;
  wrapperRefs.current = wrapperRefs.current.slice(0, count);

  // Scrolls so the target card's left edge lines up with the viewport's
  // *padded* content edge (not its outer border edge) -- matches where
  // snap-start actually rests. Clamped to the container's real scrollable
  // range so it never asks for a position past what's reachable.
  useEffect(() => {
    const viewport = viewportRef.current;
    const el = wrapperRefs.current[index];
    if (!viewport || !el) return;
    const paddingLeft = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
    const viewportRect = viewport.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const delta = elRect.left - (viewportRect.left + paddingLeft);
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const target = Math.min(Math.max(viewport.scrollLeft + delta, 0), maxScroll);
    viewport.scrollTo({ left: target, behavior: "smooth" });
  }, [index]);

  // Manual arrow clicks stop at the ends instead of wrapping -- wrapping
  // meant "previous" from the first card jumped all the way to the last
  // one, scrolling hard in the direction opposite what the arrow implied
  // (and the mirror case on "next" from the last card). Autoplay is the one
  // exception: it's expected to loop back to the start on its own.
  const advance = useCallback(
    (dir) => {
      setIndex((i) => Math.min(Math.max(i + dir, 0), count - 1));
    },
    [count]
  );

  const autoAdvance = useCallback(() => {
    setIndex((i) => (i >= count - 1 ? 0 : i + 1));
  }, [count]);

  const startAutoplay = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(autoAdvance, AUTOPLAY_MS);
  }, [autoAdvance]);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timerRef.current);
  }, [startAutoplay]);

  const handleArrow = (dir) => {
    advance(dir);
    startAutoplay();
  };

  const pause = () => clearInterval(timerRef.current);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-[312px] border-t-2 border-gold/50" />

      <div
        ref={viewportRef}
        className="flex min-w-0 snap-x snap-mandatory gap-6 overflow-x-auto py-3 pl-6 pr-16 sm:gap-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={pause}
        onMouseLeave={startAutoplay}
        onTouchStart={pause}
        onTouchEnd={startAutoplay}
      >
        {items.map((child, i) => (
          <div
            key={child.key ?? i}
            ref={(node) => {
              wrapperRefs.current[i] = node;
            }}
            className="shrink-0 snap-start opacity-100"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Touch swipe drives it on phones -- arrows are for pointer/keyboard */}
      <div className="mt-6 hidden items-center justify-end gap-2 lg:flex">
        <button
          type="button"
          onClick={() => handleArrow(-1)}
          aria-label="Previous milestone"
          disabled={index === 0}
          className="flex size-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold/10 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowLeftIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => handleArrow(1)}
          aria-label="Next milestone"
          disabled={index === count - 1}
          className="flex size-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold/10 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ArrowRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function AboutTimeline({ milestones, values }) {
  const [first, ...rest] = milestones;

  return (
    <TimelineSlider>
      <FeaturedMilestone milestone={first} delay={0} />
      <ValuesCard values={values} delay={100} />
      {rest.map((m, i) => (
        <MilestoneRow key={m.year} milestone={m} delay={(i + 2) * 100} />
      ))}
    </TimelineSlider>
  );
}

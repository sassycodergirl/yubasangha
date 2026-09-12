"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/icons";

// Uniform footprint per item -- every card claims the same horizontal slot
// regardless of its visual (scaled) size, which keeps the centering math a
// plain formula instead of needing to measure the DOM.
const CARD_WIDTH = 520;
const GAP = 0;
const STEP = CARD_WIDTH + GAP;
const AUTOPLAY_MS = 4200;

// Scale/opacity/stack-order by distance from the centered item -- gives the
// coverflow look (big focused center, smaller fading items either side).
// Clamped so this still reads fine how ever many items admin adds later.
function cardLook(distance) {
  const d = Math.min(distance, 3);
  return {
    scale: [1, 0.82, 0.68, 0.58][d],
    opacity: [1, 0.8, 0.5, 0.28][d],
  };
}

export default function ThemeGallery({ items }) {
  const count = items.length;
  const [index, setIndex] = useState(() => Math.floor((count - 1) / 2));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timerRef = useRef(null);

  // Wraps in both directions -- there's no "end" to this slider, prev/next
  // (and autoplay) just keep cycling through the items indefinitely.
  const goTo = useCallback(
    (next) => setIndex(((next % count) + count) % count),
    [count]
  );

  const startAutoplay = useCallback(() => {
    clearInterval(timerRef.current);
    if (count <= 1 || lightboxOpen) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
  }, [count, lightboxOpen]);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timerRef.current);
  }, [startAutoplay]);

  const pause = () => clearInterval(timerRef.current);

  const handleArrow = (dir) => {
    goTo(index + dir);
    startAutoplay();
  };

  // Clicking the centered card opens it full-size; clicking a side card just
  // brings it to center first, matching how the arrows already behave.
  const handleCardClick = (i) => {
    if (i === index) {
      pause();
      setLightboxOpen(true);
    } else {
      goTo(i);
      startAutoplay();
    }
  };

  // Escape closes the lightbox. `startAutoplay` itself already depends on
  // `lightboxOpen` (see above), so the main effect re-running when it
  // changes is what resumes autoplay on close -- nothing extra needed here.
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => e.key === "Escape" && setLightboxOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  return (
    <div
      className="relative"
      onMouseEnter={pause}
      onMouseLeave={startAutoplay}
      onTouchStart={pause}
      onTouchEnd={startAutoplay}
    >
      <div className="relative h-80 overflow-hidden sm:h-96">
        {items.map((item, i) => {
          // Shortest signed distance around the loop -- without this,
          // wrapping from the last card back to the first would compute as
          // a huge raw offset (i - index) and animate as one big jump
          // across the whole gallery instead of a single continuing step.
          let offset = i - index;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;
          const distance = Math.abs(offset);
          if (distance > 4) return null;
          const { scale, opacity } = cardLook(distance);
          const active = i === index;

          return (
            <div
              key={item.label}
              className="absolute top-1/2 transition-all duration-500 ease-out"
              style={{
                left: `calc(50% + ${offset * STEP}px)`,
                width: CARD_WIDTH,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                zIndex: 10 - distance,
              }}
            >
              <button
                type="button"
                onClick={() => handleCardClick(i)}
                aria-label={active ? `Open ${item.label} image` : `Show ${item.label}`}
                className={`relative mx-auto block w-full cursor-pointer overflow-hidden rounded-lg bg-ink shadow-xl transition-all duration-500 ${
                  active
                    ? "h-72 border-2 border-gold shadow-[0_0_35px_-8px_rgba(201,154,59,0.6)] sm:h-80"
                    : "h-56 border border-white/10 sm:h-64"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  unoptimized
                  sizes="300px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-ink/85 px-2 py-2 text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.15em] text-gold">
                    {item.label}
                  </p>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => handleArrow(-1)}
        aria-label="Previous"
        className="absolute left-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-ink/60 text-gold backdrop-blur-sm transition-colors hover:bg-gold/10"
      >
        <ArrowLeftIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => handleArrow(1)}
        aria-label="Next"
        className="absolute right-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-ink/60 text-gold backdrop-blur-sm transition-colors hover:bg-gold/10"
      >
        <ArrowRightIcon className="size-4" />
      </button>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          role="dialog"
          aria-modal="true"
          aria-label={items[index].label}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute inset-0"
          />

          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close image"
            className="absolute right-5 top-5 z-10 flex size-10 items-center justify-center rounded-full border border-gold/40 bg-ink/70 text-gold transition-colors hover:bg-gold/10"
          >
            <CloseIcon className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-ink/70 text-gold transition-colors hover:bg-gold/10"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-ink/70 text-gold transition-colors hover:bg-gold/10"
          >
            <ArrowRightIcon className="size-5" />
          </button>

          <div className="relative z-10 flex max-h-full max-w-4xl flex-col items-center">
            <div className="relative max-h-[75vh] w-full overflow-hidden rounded-lg border-2 border-gold shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element -- natural size in a lightbox, not a fixed `fill` box */}
              <img
                src={items[index].image}
                alt={items[index].label}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.15em] text-gold">
              {items[index].label}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

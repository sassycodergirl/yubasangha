"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/icons";

// Plain grid version of the same gallery data ThemeGallery's coverflow
// slider uses -- Theme 2026 page wants every item visible at once instead of
// one-at-a-time, still opening a lightbox on click.
export default function ThemeGalleryGrid({ items }) {
  const count = items.length;
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex, count]);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-6">
        {items.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Open ${item.label} image`}
            className="group relative aspect-[4/3] w-full max-w-sm shrink-0 overflow-hidden rounded-lg border border-gold/40 bg-ink shadow-lg transition-colors hover:border-gold sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <Image
              src={item.image}
              alt={item.label}
              fill
              unoptimized
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-ink/85 px-3 py-2.5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
                {item.label}
              </p>
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          role="dialog"
          aria-modal="true"
          aria-label={items[openIndex].label}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            className="absolute inset-0"
          />

          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close image"
            className="absolute right-5 top-5 z-10 flex size-10 items-center justify-center rounded-full border border-gold/40 bg-ink/70 text-gold transition-colors hover:bg-gold/10"
          >
            <CloseIcon className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => setOpenIndex((openIndex - 1 + count) % count)}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-ink/70 text-gold transition-colors hover:bg-gold/10"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setOpenIndex((openIndex + 1) % count)}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-ink/70 text-gold transition-colors hover:bg-gold/10"
          >
            <ArrowRightIcon className="size-5" />
          </button>

          <div className="relative z-10 flex max-h-full max-w-4xl flex-col items-center">
            <div className="relative max-h-[75vh] w-full overflow-hidden rounded-lg border-2 border-gold shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element -- natural size in a lightbox, not a fixed `fill` box */}
              <img
                src={items[openIndex].image}
                alt={items[openIndex].label}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.15em] text-gold">
              {items[openIndex].label}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/icons";

const GAP = 12; // px -- keep in sync with the row/item gap classes below

function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

// Classic "justified gallery" packing (Flickr / Google Photos style): keep
// adding items to a row, scaling them to a shared height, until that
// height (needed to make the row's width add up to exactly the container
// width) drops to the target -- then lock the row in at that height and
// start the next one. Every finished row is full-width *by construction*,
// not by luck -- unlike a fixed-span CSS grid, this can't leave a gap no
// matter how many items there are or what filter is active, which matters
// since this gallery's content is admin-fed and open-ended.
function layoutJustifiedRows(items, containerWidth, targetHeight, gap) {
  if (!containerWidth) return [];
  const rows = [];
  let current = [];
  let ratioSum = 0;

  const finalizeRow = (stretch) => {
    if (current.length === 0) return;
    const totalGap = gap * (current.length - 1);
    const height = stretch ? (containerWidth - totalGap) / ratioSum : targetHeight;
    rows.push(current.map((item) => ({ ...item, height, width: height * item.ratio })));
    current = [];
    ratioSum = 0;
  };

  items.forEach((item) => {
    current.push(item);
    ratioSum += item.ratio;
    const totalGap = gap * (current.length - 1);
    const naturalHeight = (containerWidth - totalGap) / ratioSum;
    if (naturalHeight <= targetHeight) finalizeRow(true);
  });
  // Leftover row (too few items to reach the target density): shown at
  // natural size rather than stretched -- standard justified-gallery
  // behaviour, avoids grotesquely blowing up the last couple of photos.
  finalizeRow(false);

  return rows;
}

function ViewAllTile({ viewAll, style, light }) {
  return (
    <Link
      href={viewAll.href}
      style={style}
      className={`group flex shrink-0 flex-col items-center justify-center gap-2 rounded-lg border text-center transition-colors ${
        light
          ? "border-maroon/30 bg-black/[0.03] hover:border-maroon hover:bg-black/[0.06]"
          : "border-gold/30 bg-white/[0.03] hover:border-gold hover:bg-white/[0.06]"
      }`}
    >
      <span
        className={`flex size-8 items-center justify-center rounded-full border transition-colors ${
          light
            ? "border-maroon/50 text-maroon group-hover:bg-maroon/10"
            : "border-gold/50 text-gold group-hover:bg-gold/10"
        }`}
      >
        <ArrowRightIcon className="size-3.5" />
      </span>
      <span
        className={`px-2 text-[10px] font-semibold uppercase leading-tight tracking-wide ${
          light ? "text-ink" : "text-white"
        }`}
      >
        {viewAll.label}
      </span>
    </Link>
  );
}

// `light=true` renders on the shared inner-page intro background (#d3d1d1,
// dark text) instead of the homepage's dark bg-ink -- used on the Gallery
// page, which reuses this whole section as its own content. `maxRows` caps
// how many rows of photos show per filter -- the homepage passes 2 (a
// teaser, with a "View All Gallery" tile at the end of it); the Gallery page
// leaves it unset to show every photo, with no "View All" tile since it IS
// the full gallery already.
export default function Gallery({ content, light = false, maxRows = null }) {
  const { eyebrow, filters, images, viewAll } = content;
  const [activeFilter, setActiveFilter] = useState("all");
  const [containerRef, containerWidth] = useContainerWidth();
  // Index into `filtered` (below) of the photo open in the lightbox, or null
  // when it's closed -- same click-to-open pattern as the Theme 2026
  // gallery (see ThemeGalleryGrid.jsx).
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? images
        : images.filter((image) => image.categories.includes(activeFilter)),
    [images, activeFilter]
  );

  const items = useMemo(
    () => (maxRows == null ? filtered : [...filtered, { id: "view-all", kind: "view-all", ratio: 0.9 }]),
    [filtered, maxRows]
  );

  const targetHeight = containerWidth < 640 ? 130 : containerWidth < 1024 ? 170 : 220;
  const allRows = layoutJustifiedRows(items, containerWidth, targetHeight, GAP);

  // Cap to `maxRows` rows for the homepage teaser. If that cuts off the
  // trailing "View All" tile, swap it into the last visible slot instead of
  // growing an extra row just to fit it in.
  let rows = allRows;
  if (maxRows != null && allRows.length > maxRows) {
    rows = allRows.slice(0, maxRows).map((row) => row.slice());
    const hasViewAll = rows.some((row) => row.some((item) => item.kind === "view-all"));
    if (!hasViewAll) {
      const lastRow = rows[rows.length - 1];
      const { width, height } = lastRow[lastRow.length - 1];
      lastRow[lastRow.length - 1] = { id: "view-all", kind: "view-all", width, height };
    }
  }

  const count = filtered.length;

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
    <section
      className={`relative overflow-hidden py-16 sm:py-20 ${
        light ? "bg-[#d3d1d1]" : "bg-ink text-white"
      }`}
    >
      {!light && (
        <>
          <SectionBackground image={null} />
          <SectionBlend />
          <div className="pointer-events-none absolute inset-0 bg-black/40" />
        </>
      )}

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <p
          className={`text-center font-display text-2xl font-bold uppercase tracking-[0.15em] sm:text-3xl ${
            light ? "text-maroon" : "text-gold"
          }`}
        >
          {eyebrow}
        </p>

        {/* Filter tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {filters.map((filter) => {
            const active = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
                  light
                    ? active
                      ? "border-maroon bg-maroon/10 text-maroon"
                      : "border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink"
                    : active
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 flex  flex-col items-center gap-6 py-6">
            <p className={`text-sm ${light ? "text-ink/50" : "text-white/50"}`}>
              No photos in this category yet.
            </p>
            {maxRows != null ? (
              <ViewAllTile viewAll={viewAll} style={{ width: 160, height: 140 }} light={light} />
            ) : null}
          </div>
        ) : (
          <div ref={containerRef} className="mt-8 flex flex-col gap-3">
            {rows.map((row, i) => (
              <div key={i} className="flex justify-center gap-3">
                {row.map((item) =>
                  item.kind === "view-all" ? (
                    <ViewAllTile
                      key={item.id}
                      viewAll={viewAll}
                      style={{ width: item.width, height: item.height }}
                      light={light}
                    />
                  ) : (
                    <button
                      key={item.id}
                      type="button"
                      style={{ width: item.width, height: item.height }}
                      onClick={() => setOpenIndex(filtered.findIndex((f) => f.id === item.id))}
                      aria-label={`Open ${item.alt}`}
                      className={`group relative block shrink-0 overflow-hidden rounded-lg border ${
                        light ? "border-maroon/20" : "border-gold/20"
                      }`}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        unoptimized
                        loading="lazy"
                        sizes="(min-width: 1024px) 400px, 60vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {openIndex !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          role="dialog"
          aria-modal="true"
          aria-label={filtered[openIndex].alt}
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
            <div className="relative max-h-[80vh] w-full overflow-hidden rounded-lg border-2 border-gold shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element -- natural size in a lightbox, not a fixed `fill` box */}
              <img
                src={filtered[openIndex].src}
                alt={filtered[openIndex].alt}
                className="max-h-[80vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

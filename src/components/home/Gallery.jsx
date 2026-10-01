"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, PlayIcon, ImageIcon } from "@/components/ui/icons";
import {
  getYoutubeId,
  getYoutubeThumbnail,
  getFacebookEmbedUrl,
  getInstagramEmbedUrl,
} from "@/lib/videoEmbeds";

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
// the full gallery already. `maxVideos` separately caps how many *video*
// items appear at all (the homepage passes 3) -- unlike `maxRows`, which
// just stops packing more rows once it's hit the limit, this trims videos
// specifically before that packing happens, so a teaser can't end up mostly
// (or entirely) video tiles just because a filter/admin ordering happened to
// front-load them; it still shows as many photos as `maxRows` allows.
export default function Gallery({ content, light = false, maxRows = null, maxVideos = null }) {
  const { eyebrow, filters, images, viewAll } = content;
  const [activeFilter, setActiveFilter] = useState("all");
  const [containerRef, containerWidth] = useContainerWidth();
  // Index into `filtered` (below) of the photo open in the lightbox, or null
  // when it's closed -- same click-to-open pattern as the Theme 2026
  // gallery (see ThemeGalleryGrid.jsx).
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = useMemo(() => {
    const scoped =
      activeFilter === "all"
        ? images
        : images.filter((image) => image.categories.includes(activeFilter));
    let videoCount = 0;
    const base =
      maxVideos == null
        ? scoped
        : scoped.filter((image) => {
            if (!image.isVideo) return true;
            videoCount += 1;
            return videoCount <= maxVideos;
          });
    // `ratio` drives the justified-row math below (row height = available
    // width / sum of ratios) -- a missing or zero ratio (e.g. a freshly
    // admin-added item whose "Ratio" field was left at its 0 default) would
    // divide by zero and break every row after it, so every item gets a
    // usable ratio here regardless of what's actually saved. `_key` is a
    // stable React key independent of the admin-editable (and possibly
    // blank, possibly duplicated) `id` field.
    //
    // A video item with no uploaded `src` still gets a real thumbnail
    // without any manual upload where possible: YouTube serves a plain
    // poster-image URL (`getYoutubeThumbnail`), and Facebook's plugin embed
    // resolves and shows the real poster frame regardless (that's the
    // "RJ Praveen ... ▶" card you see before pressing play in the lightbox)
    // -- `_previewEmbedUrl` reuses that same embed, paused and
    // non-interactive, as the grid tile's visual instead (see the tile
    // render below). Instagram deliberately isn't included here (tried and
    // reverted): its card has a hard minimum *height* (header + media +
    // "View more on Instagram" footer) that's taller than any uniform
    // gallery row -- forced down to row height it scrolls/clips internally,
    // given room to render cleanly it breaks every row's uniform height
    // instead. There's no third option, so it keeps the plain placeholder
    // tile until an admin uploads a real photo. Same for a direct
    // video-file URL (no platform match): no thumbnail possible without an
    // upload either way.
    return base.map((image, i) => {
      const youtubeId = image.isVideo ? getYoutubeId(image.videoUrl) : null;
      const usingYoutubeThumb = !image.src && youtubeId;
      const previewEmbedUrl =
        image.isVideo && !image.src ? getFacebookEmbedUrl(image.videoUrl, { autoplay: false }) : null;
      return {
        ...image,
        // YouTube's hqdefault.jpg is always a fixed 480x360 (4:3) regardless
        // of the real video's aspect -- an unset ratio otherwise falls back
        // to a square tile (1), which was cropping that 4:3 frame's sides
        // off via object-cover. A real uploaded photo keeps whatever ratio
        // the admin entered for it. Facebook's plugin has a documented
        // ~180px minimum width -- a plain ratio of 1 could still dip under
        // that at the smallest (mobile) target row height, so it gets a
        // slightly wider ratio instead.
        ratio: image.ratio > 0 ? image.ratio : usingYoutubeThumb ? 480 / 360 : previewEmbedUrl ? 1.4 : 1,
        src: image.src || (youtubeId ? getYoutubeThumbnail(youtubeId) : image.src),
        _previewEmbedUrl: previewEmbedUrl,
        _key: `${image.id || "item"}-${i}`,
      };
    });
  }, [images, activeFilter]);

  const items = useMemo(
    () =>
      maxRows == null
        ? filtered
        : [...filtered, { _key: "view-all", kind: "view-all", ratio: 0.9 }],
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
      lastRow[lastRow.length - 1] = { _key: "view-all", kind: "view-all", width, height };
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
                      key={item._key}
                      viewAll={viewAll}
                      style={{ width: item.width, height: item.height }}
                      light={light}
                    />
                  ) : (
                    <button
                      key={item._key}
                      type="button"
                      style={{ width: item.width, height: item.height }}
                      onClick={() => setOpenIndex(filtered.findIndex((f) => f._key === item._key))}
                      aria-label={`Open ${item.alt}`}
                      className={`group relative block shrink-0 cursor-pointer overflow-hidden rounded-lg border ${
                        light ? "border-maroon/20" : "border-gold/20"
                      }`}
                    >
                      {item.src ? (
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          unoptimized
                          loading="lazy"
                          sizes="(min-width: 1024px) 400px, 60vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : item._previewEmbedUrl ? (
                        // No uploaded photo and no plain thumbnail URL
                        // (Facebook) -- the platform's own embed still
                        // resolves and shows the real poster frame, so it's
                        // reused here, paused and `pointer-events-none` so
                        // the click still opens *our* lightbox instead of
                        // interacting with the embed directly. Platform
                        // chrome (profile pic/name/share button) rides along
                        // with it -- there's no param to strip just that and
                        // keep the poster, so a tile using this looks busier
                        // than a clean uploaded photo would. Facebook's embed
                        // positions its header + video from the `width`/
                        // `height` it's told, not from the iframe's actual
                        // CSS box -- passing the tile's real size here (vs.
                        // letting it assume its own default and then get
                        // CSS-stretched) is what keeps its own play button
                        // centered in the video instead of drifting off to
                        // one side.
                        <iframe
                          src={`${item._previewEmbedUrl}&width=${Math.round(item.width)}&height=${Math.round(item.height)}`}
                          title={item.alt}
                          loading="lazy"
                          tabIndex={-1}
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 h-full w-full"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
                          <ImageIcon className="size-6 text-gold/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      {item.isVideo && !item._previewEmbedUrl ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="flex size-10 items-center justify-center rounded-full bg-white/90 text-maroon shadow-lg transition-transform group-hover:scale-110">
                            <PlayIcon className="size-4 translate-x-0.5" />
                          </span>
                        </div>
                      ) : null}
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
            className="absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gold/40 bg-ink/70 text-gold transition-colors hover:bg-gold/10"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setOpenIndex((openIndex + 1) % count)}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gold/40 bg-ink/70 text-gold transition-colors hover:bg-gold/10"
          >
            <ArrowRightIcon className="size-5" />
          </button>

          <div className="relative z-10 flex max-h-full max-w-4xl flex-col items-center">
            {filtered[openIndex].isVideo ? (
              <GalleryVideo item={filtered[openIndex]} />
            ) : (
              <div className="relative flex max-h-[80vh] min-h-40 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-gold shadow-2xl">
                {filtered[openIndex].src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- natural size in a lightbox, not a fixed `fill` box
                  <img
                    src={filtered[openIndex].src}
                    alt={filtered[openIndex].alt}
                    className="max-h-[80vh] w-full object-contain"
                  />
                ) : (
                  <ImageIcon className="size-10 text-gold/50" />
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

// Landscape box (YouTube, a direct video file, or the no-URL-yet fallback)
// vs. the portrait one below -- Facebook/Instagram links shared out of a
// gallery are overwhelmingly Reels, and forcing a 9:16 clip into a 16:9 box
// is exactly what was making those look "zoomed in": the platform's own
// player fills whatever box it's given, cropping to do it. There's no way to
// know a video's real aspect ratio from its URL alone, so this is a
// deliberate per-platform default, not a measurement.
const LANDSCAPE_BOX = "relative aspect-video w-[min(80vw,900px)] overflow-hidden rounded-lg border-2 border-gold shadow-2xl";
const PORTRAIT_BOX = "relative aspect-[9/16] h-[min(80vh,800px)] max-w-[90vw] overflow-hidden rounded-lg border-2 border-gold shadow-2xl";

// Lightbox playback for a video item -- a platform embed when `videoUrl`
// matches a known shape (YouTube, Facebook, or Instagram), otherwise a plain
// <video> tag so a direct file URL (mp4/webm/etc) still plays. Falls back to
// the poster image alone, no player chrome, if no URL has been set yet.
function GalleryVideo({ item }) {
  const youtubeId = getYoutubeId(item.videoUrl);
  const facebookEmbedUrl = getFacebookEmbedUrl(item.videoUrl);
  const instagramEmbedUrl = getInstagramEmbedUrl(item.videoUrl);

  if (youtubeId) {
    return (
      <div className={LANDSCAPE_BOX}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={item.alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  if (facebookEmbedUrl) {
    return (
      <div className={PORTRAIT_BOX}>
        <iframe
          src={facebookEmbedUrl}
          title={item.alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  if (instagramEmbedUrl) {
    return (
      // Instagram's plain iframe embed has a hard limitation this code can't
      // route around: it's a static "tap to open on Instagram" card for a
      // logged-out viewer, not a real inline player -- Instagram withholds
      // actual autoplay from every embed on the web, including their own
      // official JS widget, not just this simpler iframe form. Sized as a
      // reel (same as Facebook) so at least the card itself isn't squashed,
      // but the click-through and Instagram's own scrollbar around its card
      // chrome are both coming from Instagram's frame, not this page.
      <div className={PORTRAIT_BOX}>
        <iframe
          src={instagramEmbedUrl}
          title={item.alt}
          allow="encrypted-media"
          allowFullScreen
          className="absolute inset-0 h-full w-full overflow-auto bg-white"
        />
      </div>
    );
  }

  if (item.videoUrl) {
    return (
      <div className={LANDSCAPE_BOX}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- admin-supplied video, no caption track available */}
        <video
          src={item.videoUrl}
          poster={item.src || undefined}
          controls
          autoPlay
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={LANDSCAPE_BOX}>
      {item.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- poster shown as a plain fallback, no player chrome without a URL
        <img src={item.src} alt={item.alt} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
          <ImageIcon className="size-10 text-gold/50" />
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import { ExpandIcon, UserIcon, PlayIcon } from "@/components/ui/icons";

function LiveBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${className}`}
    >
      <span className="size-1.5 animate-pulse rounded-full bg-white" />
      Live
    </span>
  );
}

function formatCompact(n) {
  if (n === null) return "--";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// Phase 1 fallback: a plausible-looking count that ticks upward on its own.
// Phase 2: swap this for a real number polled from a server route that
// calls the YouTube Data API v3 (concurrentViewers) -- same shape (a
// number), so nothing downstream needs to change. Same behaviour as the
// homepage's LiveDarshan section.
function useLiveCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    setCount(Math.floor(1000 + Math.random() * 9000));
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return count;
}

const AVATAR_COUNT = 5;

function requestFullscreenOn(el) {
  if (!el) return;
  const request = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
  request?.call(el);
}

// Live Darshan page's own take on the homepage's LiveDarshan section --
// same presentation content, but with the extra room a dedicated page has: a
// full-width hero-style intro leading into a larger stream, then devotee
// count + fullscreen as a single toolbar underneath instead of squeezed
// into side columns. Sits on the shared inner-page background (#d3d1d1,
// dark text) per convention.
//
// `videos` is every published video from the Live Darshan collection (see
// src/lib/liveVideos.js) -- the featured one always plays in the main
// player above; every other one gets its own tile in the dark "More Live
// Videos" section below that plays inline, in place, when clicked (its own
// real YouTube embed with controls swapped in for the thumbnail) -- not by
// changing the main player, which was confusing (a click down here with the
// result appearing somewhere else, out of view).
export default function LiveDarshanShowcase({ content, videos }) {
  const { eyebrow, tagline, devoteesLabel, fullscreenLabel } = content;
  const devotees = useLiveCounter();
  const videoWrapRef = useRef(null);
  const tileWrapRefs = useRef({});

  const featured = videos.find((v) => v.featured) ?? videos[0] ?? null;
  const others = videos.filter((v) => v.id !== featured?.id);
  const [playingId, setPlayingId] = useState(null);

  const handleFullscreen = () => requestFullscreenOn(videoWrapRef.current);

  function handleTileFullscreen(video) {
    if (playingId !== video.id) setPlayingId(video.id);
    requestFullscreenOn(tileWrapRefs.current[video.id]);
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#d3d1d1] py-20 sm:py-28">
        <div className="relative mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.35em] text-maroon">{eyebrow}</p>
              <LiveBadge />
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl">
              Witness the Darshan,
              <span className="block text-maroon">Live from the Pandal</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink/70">{tagline}</p>
          </div>

          {/* Stream */}
          <div
            ref={videoWrapRef}
            className="relative mt-14 aspect-video w-full overflow-hidden rounded-2xl border-2 border-gold bg-black shadow-[0_25px_60px_-20px_rgba(52,31,20,0.5)]"
          >
            {featured?.youtubeVideoId ? (
              <iframe
                key={featured.id}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${featured.youtubeVideoId}?autoplay=1&mute=1&playsinline=1&modestbranding=1&rel=0`}
                title={featured.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-maroon/40 via-ink to-ink px-4 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Live stream begins soon
                </p>
              </div>
            )}

            <div className="absolute right-3 top-3 flex items-center gap-2">
              <LiveBadge />
              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                {formatCompact(devotees)}
              </span>
            </div>
          </div>

          {/* Toolbar: devotee count + fullscreen, spread across the full
              width now that they're not sharing a row with the video. */}
          <div className="mt-10 flex flex-col items-center justify-between gap-8 rounded-2xl border border-ink/10 bg-white/40 px-8 py-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {Array.from({ length: AVATAR_COUNT }).map((_, i) => (
                  <span
                    key={i}
                    className="flex size-9 items-center justify-center rounded-full border-2 border-[#d3d1d1] bg-gradient-to-b from-maroon to-maroon-dark"
                  >
                    <UserIcon className="size-4 text-white/90" />
                  </span>
                ))}
              </div>
              <div className="text-left">
                <p className="font-display text-2xl font-bold text-ink">
                  {devotees === null ? "--" : devotees.toLocaleString()}
                </p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-maroon">{devoteesLabel}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFullscreen}
              className="inline-flex items-center gap-2 rounded-full border border-maroon/40 px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-ink transition-colors hover:border-maroon hover:text-maroon"
            >
              {fullscreenLabel}
              <ExpandIcon className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* More videos -- its own dark section (a deliberate break from the
          page's light intro tone above, blended via SectionBlend) so this
          grid reads as its own showcase rather than an afterthought tacked
          onto the bottom of the light section. Each tile plays inline, in
          place, when clicked (its thumbnail is replaced with a real YouTube
          embed, complete with YouTube's own controls) rather than changing
          the main player above, so the result of a click is never somewhere
          else, out of view. Thumbnails come straight from YouTube's own CDN
          (no separate upload needed). Large tiles, capped at 2 per row even
          on wide screens (one per row on phones) so each still reads as its
          own showcase rather than a shrunken-down thumbnail strip. */}
      {others.length > 0 ? (
        <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
          <SectionBackground image={null} fallback="none" />
          <SectionBlend />

          {/* Same warm ambient glow as the homepage's About section, so this
              dark section doesn't read as a flat, empty black band. */}
          <div className="pointer-events-none absolute -left-40 top-1/3 size-[28rem] rounded-full bg-maroon/25 blur-[120px]" />
          <div className="pointer-events-none absolute -right-40 bottom-0 size-[24rem] rounded-full bg-gold/10 blur-[120px]" />

          <div className="relative mx-auto max-w-5xl px-6 sm:px-10 lg:px-16">
            <p className="text-center text-[11px] uppercase tracking-[0.35em] text-gold">
              More Live Videos
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {others.map((video) => {
                const playing = playingId === video.id;
                return (
                  <div
                    key={video.id}
                    className="overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.03] shadow-lg transition-colors hover:border-gold/40"
                  >
                    <div
                      ref={(el) => {
                        tileWrapRefs.current[video.id] = el;
                      }}
                      className="relative aspect-video w-full overflow-hidden bg-black"
                    >
                      {playing ? (
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={`https://www.youtube.com/embed/${video.youtubeVideoId}?autoplay=1&playsinline=1&modestbranding=1&rel=0`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPlayingId(video.id)}
                          aria-label={`Play ${video.title}`}
                          className="group absolute inset-0 h-full w-full"
                        >
                          <Image
                            src={`https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`}
                            alt={video.title}
                            fill
                            unoptimized
                            sizes="(min-width: 640px) 45vw, 90vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/45" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-maroon shadow-lg transition-transform group-hover:scale-110">
                              <PlayIcon className="size-7 translate-x-0.5" />
                            </span>
                          </span>
                        </button>
                      )}

                      {playing ? <LiveBadge className="absolute left-3 top-3" /> : null}
                    </div>

                    {/* Title + fullscreen, side by side -- makes use of the
                        row's full width instead of leaving it mostly empty
                        next to a short title. */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                      <p className="truncate text-sm font-semibold uppercase tracking-wide text-white">
                        {video.title}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleTileFullscreen(video)}
                        aria-label={`Open ${video.title} in fullscreen`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] text-gold transition-colors hover:border-gold hover:bg-gold/10"
                      >
                        <ExpandIcon className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import GhostButton from "@/components/ui/GhostButton";
import { ArrowRightIcon, ExpandIcon, UserIcon } from "@/components/ui/icons";
import { openOnYoutube } from "@/lib/fullscreen";

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
// number), so nothing downstream needs to change.
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

export default function LiveDarshan({ content, youtubeVideoId }) {
  const { eyebrow, tagline, cta, fullscreenLabel, devoteesLabel, backgroundImage } = content;
  const devotees = useLiveCounter();
  const videoWrapRef = useRef(null);
  const iframeRef = useRef(null);

  // iOS Safari only supports the Fullscreen API on the actual video-bearing
  // element (the iframe), not an arbitrary wrapping <div> -- targeting the
  // div (as this used to) silently no-ops there. Some older iOS versions
  // don't support it at all even on the iframe, so if the request fails (or
  // there's nothing to call it on), fall back to opening the stream
  // directly on YouTube, where fullscreen always works.
  const handleFullscreen = () => {
    const el = iframeRef.current;
    const request = el?.requestFullscreen || el?.webkitRequestFullscreen;
    const result = request?.call(el);
    if (result?.catch) {
      result.catch(() => openOnYoutube(youtubeVideoId));
    } else if (!result) {
      openOnYoutube(youtubeVideoId);
    }
  };

  return (
    <section className="relative overflow-hidden bg-ink py-16 text-white sm:py-20">
      <SectionBackground image={backgroundImage} />


      {/* Ambient glow either side, standing in for the reference's diya flames */}
      <div className="pointer-events-none absolute -left-32 top-1/2 size-72 -translate-y-1/2 rounded-full bg-maroon/30 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 top-1/2 size-72 -translate-y-1/2 rounded-full bg-gold/15 blur-[100px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_1.9fr_0.55fr] lg:items-center">
          {/* Left: intro */}
          <div className="min-w-0 text-center lg:text-left">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-gold sm:text-3xl">
                {eyebrow}
              </h2>
              <LiveBadge />
            </div>
            <p className="mx-auto mt-3 max-w-xs text-sm text-white/65 lg:mx-0">{tagline}</p>
            <GhostButton href={cta.href} className="mt-6">
              {cta.label}
              <ArrowRightIcon className="size-4" />
            </GhostButton>
          </div>

          {/* Center: the stream itself */}
          <div
            id="live-video"
            ref={videoWrapRef}
            className="relative aspect-video w-full scroll-mt-28 overflow-hidden rounded-xl border-2 border-gold bg-black shadow-[0_0_40px_-10px_rgba(201,154,59,0.45)]"
          >
            {youtubeVideoId ? (
              <iframe
                ref={iframeRef}
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&playsinline=1&modestbranding=1&rel=0`}
                title={eyebrow}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-maroon/40 via-ink to-ink text-center px-4">
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

          {/* Right: devotee count + fullscreen */}
          <div className="min-w-0 text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">{devoteesLabel}</p>
            <p className="mt-1 font-display text-4xl font-bold text-white">
              {devotees === null ? "--" : devotees.toLocaleString()}
            </p>

            <div className="mt-3 flex justify-center -space-x-2.5 lg:justify-start">
              {Array.from({ length: AVATAR_COUNT }).map((_, i) => (
                <span
                  key={i}
                  className="flex size-8 items-center justify-center rounded-full border-2 border-ink bg-gradient-to-b from-maroon to-maroon-dark"
                >
                  <UserIcon className="size-4 text-white/80" />
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={handleFullscreen}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:border-gold hover:text-gold"
            >
              {fullscreenLabel}
              <ExpandIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

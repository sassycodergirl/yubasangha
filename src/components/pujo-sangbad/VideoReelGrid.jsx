"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon, ImageIcon, CloseIcon } from "@/components/ui/icons";
import {
  getYoutubeId,
  getYoutubeThumbnail,
  getFacebookEmbedUrl,
  getInstagramEmbedUrl,
} from "@/lib/videoEmbeds";

// Shared by both the Pujo Sangbad page (light, every video) and the
// homepage's Puja Spotlight teaser (dark, capped to 6, done by the caller)
// -- `light` swaps card text/background between the two, same convention
// as Gallery.jsx's own `light` prop.
//
// Thumbnail resolution mirrors Gallery.jsx's: a manually uploaded `src`
// always wins; a YouTube link falls back to YouTube's own plain poster-
// image URL; a Facebook link falls back to Facebook's video plugin embed
// itself, paused and non-interactive, reused as the tile's visual (that
// plugin resolves and shows the real poster frame, same as it does in the
// lightbox -- there's just no plain image URL to pull it from ahead of
// time). Instagram's thumbnail is resolved server-side before this
// component ever sees it (see getPujoSangbadContent in
// src/lib/pujoSangbad.js) -- its embed can't shrink to a grid-tile size
// without breaking (tested first, reverted -- same finding as Gallery's),
// so there's no client-side Instagram fallback here, same as Gallery.
function resolveThumbnail(video) {
  if (video.src) return { kind: "image", src: video.src };
  if (video.uploadedVideo) return { kind: "none" };
  const youtubeId = getYoutubeId(video.videoUrl);
  if (youtubeId) return { kind: "image", src: getYoutubeThumbnail(youtubeId) };
  const facebookPreviewUrl = getFacebookEmbedUrl(video.videoUrl, { autoplay: false });
  if (facebookPreviewUrl) return { kind: "facebook-embed", src: facebookPreviewUrl };
  return { kind: "none" };
}

function VideoCard({ video, light, onOpen }) {
  const thumbnail = resolveThumbnail(video);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl text-left shadow-lg transition-transform hover:-translate-y-1 ${
        light ? "bg-white" : "border border-gold/20 bg-white/[0.04]"
      }`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-ink">
        {thumbnail.kind === "image" ? (
          <Image
            src={thumbnail.src}
            alt={video.alt || video.title}
            fill
            unoptimized
            sizes="(min-width: 1024px) 360px, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : thumbnail.kind === "facebook-embed" ? (
          // Pointer-events-none so the click still opens *our* lightbox
          // instead of interacting with the embed directly. 400x225
          // matches this tile's 16:9 box -- Facebook sizes its own header
          // + video from the `width`/`height` it's told, not from the
          // iframe's CSS box, so passing them keeps its own play button
          // centered instead of drifting off to one side.
          <iframe
            src={`${thumbnail.src}&width=400&height=225`}
            title={video.alt || video.title}
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
            <ImageIcon className="size-8 text-gold/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/30" />
        {thumbnail.kind !== "facebook-embed" ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-maroon shadow-lg transition-transform group-hover:scale-110">
              <PlayIcon className="size-5 translate-x-0.5" />
            </span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            light ? "bg-maroon/10 text-maroon" : "bg-gold/15 text-gold"
          }`}
        >
          {video.source}
        </span>
        <p
          className={`line-clamp-2 font-display text-sm font-bold leading-snug ${
            light ? "text-ink" : "text-white"
          }`}
        >
          {video.title}
        </p>
      </div>
    </button>
  );
}

// Lightbox playback -- an uploaded file takes priority over `videoUrl` when
// both are set (same "upload is the exception" reasoning as the warning on
// VideoUploadField), then the same platform-embed detection Gallery.jsx
// uses, then a direct video-file URL, then just the poster with no player.
function VideoPlayer({ video }) {
  const source = video.uploadedVideo || video.videoUrl;
  const youtubeId = !video.uploadedVideo ? getYoutubeId(source) : null;
  const facebookEmbedUrl = !video.uploadedVideo ? getFacebookEmbedUrl(source) : null;
  const instagramEmbedUrl = !video.uploadedVideo ? getInstagramEmbedUrl(source) : null;

  if (youtubeId) {
    return (
      <div className="relative aspect-video w-[min(90vw,900px)] overflow-hidden rounded-lg border-2 border-gold shadow-2xl">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  if (facebookEmbedUrl) {
    return (
      <div className="relative aspect-[9/16] h-[min(80vh,800px)] max-w-[90vw] overflow-hidden rounded-lg border-2 border-gold shadow-2xl">
        <iframe
          src={facebookEmbedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  if (instagramEmbedUrl) {
    return (
      <div className="relative aspect-[9/16] h-[min(80vh,800px)] max-w-[90vw] overflow-hidden rounded-lg border-2 border-gold shadow-2xl">
        <iframe
          src={instagramEmbedUrl}
          title={video.title}
          allow="encrypted-media"
          allowFullScreen
          className="absolute inset-0 h-full w-full overflow-auto bg-white"
        />
      </div>
    );
  }

  if (source) {
    return (
      <div className="relative aspect-video w-[min(90vw,900px)] overflow-hidden rounded-lg border-2 border-gold shadow-2xl">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- admin-supplied video, no caption track available */}
        <video
          src={source}
          poster={video.src || undefined}
          controls
          autoPlay
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="relative flex aspect-video w-[min(90vw,900px)] items-center justify-center overflow-hidden rounded-lg border-2 border-gold bg-ink shadow-2xl">
      <ImageIcon className="size-10 text-gold/50" />
    </div>
  );
}

export default function VideoReelGrid({ videos, light = false }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!videos?.length) {
    return (
      <p className={`text-center text-sm ${light ? "text-ink/50" : "text-white/50"}`}>
        No videos yet.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, i) => (
          <VideoCard key={video.id} video={video} light={light} onOpen={() => setOpenIndex(i)} />
        ))}
      </div>

      {openIndex !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          role="dialog"
          aria-modal="true"
          aria-label={videos[openIndex].title}
        >
          <button type="button" onClick={() => setOpenIndex(null)} aria-label="Close" className="absolute inset-0" />
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close video"
            className="absolute right-5 top-5 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border border-gold/40 bg-ink/70 text-gold transition-colors hover:bg-gold/10"
          >
            <CloseIcon className="size-5" />
          </button>
          <div className="relative z-10 flex max-h-full max-w-5xl flex-col items-center">
            <VideoPlayer video={videos[openIndex]} />
          </div>
        </div>
      ) : null}
    </>
  );
}

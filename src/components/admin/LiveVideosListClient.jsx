"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@/components/ui/icons";

// Exactly one video is "featured" (data.featured) at a time -- that's the
// one the homepage shows (see getFeaturedLiveVideo() in
// src/lib/liveVideos.js). The Live Darshan page shows that same one up top
// plus every other published video below it to switch to. Same pattern as
// EventsListClient.jsx.
export default function LiveVideosListClient({ videos: initialVideos }) {
  const router = useRouter();
  const [videos, setVideos] = useState(initialVideos);
  const [busyId, setBusyId] = useState(null);

  const featuredId = videos.find((v) => v.data?.featured)?.id ?? videos[0]?.id ?? null;

  async function patch(id, body) {
    setBusyId(id);
    await fetch(`/api/admin/live-videos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusyId(null);
    router.refresh();
  }

  async function togglePublished(video) {
    const published = !video.published;
    setVideos((current) => current.map((v) => (v.id === video.id ? { ...v, published } : v)));
    await patch(video.id, { published });
  }

  async function setFeatured(video) {
    setVideos((current) =>
      current.map((v) => ({ ...v, data: { ...v.data, featured: v.id === video.id } }))
    );
    await patch(video.id, { data: { ...video.data, featured: true } });
  }

  async function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= videos.length) return;

    const a = videos[index];
    const b = videos[target];
    const reordered = videos.slice();
    reordered[index] = { ...b, order: a.order };
    reordered[target] = { ...a, order: b.order };
    reordered.sort((x, y) => x.order - y.order);
    setVideos(reordered);

    setBusyId(a.id);
    await Promise.all([
      fetch(`/api/admin/live-videos/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`/api/admin/live-videos/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: a.order }),
      }),
    ]);
    setBusyId(null);
    router.refresh();
  }

  if (videos.length === 0) {
    return <p className="text-sm text-gray-700">No videos yet — add the first one above.</p>;
  }

  return (
    <div className="space-y-3">
      {videos.map((video, index) => {
        const busy = busyId === video.id;
        return (
          <div
            key={video.id}
            className="flex items-center gap-3 rounded-xl border border-gold bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex shrink-0 flex-col">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0 || busy}
                aria-label="Move up"
                className="text-gray-500 hover:text-maroon disabled:opacity-30"
              >
                <ChevronDownIcon className="size-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === videos.length - 1 || busy}
                aria-label="Move down"
                className="text-gray-500 hover:text-maroon disabled:opacity-30"
              >
                <ChevronDownIcon className="size-4" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">
                {video.title}
                {video.id === featuredId ? (
                  <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-soft">
                    Featured on homepage
                  </span>
                ) : null}
              </p>
              <p className="mt-0.5 truncate text-sm text-gray-700">{video.data?.youtubeVideoId}</p>
            </div>

            <label className="flex shrink-0 items-center gap-2 text-xs text-gray-700">
              <input
                type="radio"
                name="featured-video"
                checked={video.id === featuredId}
                onChange={() => setFeatured(video)}
                disabled={busy}
                className="size-4 border-gray-300 text-maroon focus:ring-gold/40"
              />
              Feature on homepage
            </label>

            <label className="flex shrink-0 items-center gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={video.published}
                onChange={() => togglePublished(video)}
                disabled={busy}
                className="size-4 rounded border-gray-300 text-maroon focus:ring-gold/40"
              />
              Published
            </label>

            <Link
              href={`/admin/live-darshan/${video.id}`}
              className="shrink-0 rounded-lg border border-maroon/20 bg-maroon/5 px-3 py-1.5 text-xs font-medium text-maroon transition-colors hover:border-maroon/40 hover:bg-maroon/10"
            >
              Edit
            </Link>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-gold bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all focus:border-gold focus:shadow-[0_0_0_4px_rgba(201,154,59,0.12)]";
const labelClass = "block text-xs font-medium uppercase tracking-[0.06em] text-gray-700";

const emptyVideo = { title: "", youtubeVideoId: "" };

// Fixed-shape form for one Live Darshan video -- same reasoning as
// EventForm (a hand-built form reads more clearly than a generic
// object-field renderer for a small, fixed, real-world shape). "Feature on
// homepage" isn't in this form -- like Events, that's picked from the list
// view where every video can be compared side by side.
export default function LiveVideoForm({ id, initialData, published: initialPublished = true }) {
  const router = useRouter();
  const [data, setData] = useState(() => ({ ...emptyVideo, ...initialData }));
  const [published, setPublished] = useState(initialPublished);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  function set(key, value) {
    setData((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const url = id ? `/api/admin/live-videos/${id}` : "/api/admin/live-videos";
    const response = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(id ? { data, published } : { data }),
    });
    const result = await response.json().catch(() => ({}));

    setSaving(false);
    if (!response.ok) {
      setMessage(result.error || "Failed to save.");
      return;
    }
    router.push("/admin/live-darshan");
    router.refresh();
  }

  async function handleDelete() {
    if (!id || !window.confirm(`Delete "${data.title}"? This can't be undone.`)) return;
    setDeleting(true);
    const response = await fetch(`/api/admin/live-videos/${id}`, { method: "DELETE" });
    setDeleting(false);
    if (response.ok) {
      router.push("/admin/live-darshan");
      router.refresh();
    } else {
      setMessage("Failed to delete.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className={labelClass}>
        Title
        <input
          type="text"
          required
          value={data.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Sandhi Puja Live"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        YouTube video ID
        <input
          type="text"
          required
          value={data.youtubeVideoId}
          onChange={(e) => set("youtubeVideoId", e.target.value.trim())}
          placeholder="e.g. fO9e9jnhYK8"
          className={inputClass}
        />
        <span className="mt-1.5 block text-xs font-normal normal-case tracking-normal text-gray-600">
          The part after <code>watch?v=</code> or <code>youtu.be/</code> in the video&apos;s URL —
          not the whole link.
        </span>
      </label>

      {id ? (
        <label className="flex items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 rounded border-gray-300 text-maroon focus:ring-gold/40"
          />
          Published (visible on the public site)
        </label>
      ) : null}

      <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-maroon px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-maroon-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {saving ? "Saving…" : id ? "Save changes" : "Add video"}
        </button>
        {id ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete video"}
          </button>
        ) : null}
        {message ? <span className="text-sm text-red-500">{message}</span> : null}
      </div>
    </form>
  );
}

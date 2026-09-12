"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/admin/ImageUploadField";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-gold bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all focus:border-gold focus:shadow-[0_0_0_4px_rgba(201,154,59,0.12)]";
const labelClass = "block text-xs font-medium uppercase tracking-[0.06em] text-gray-700";

// The site is India-only, so every event date is stored as an IST wall-clock
// ISO string (e.g. "2026-09-23T19:30:00+05:30") -- these just add/strip that
// fixed offset rather than doing real timezone math, so what the admin types
// is exactly what gets stored (no local-browser-timezone surprises).
function isoToLocalInput(iso) {
  return iso ? iso.slice(0, 16) : "";
}
function localInputToIso(value) {
  return value ? `${value}:00+05:30` : "";
}

const emptyEvent = {
  category: "",
  title: "",
  date: "",
  time: "",
  venue: "",
  image: null,
  summary: "",
  description: "",
};

// Fixed-shape form for one Events-collection item -- unlike AutoForm (which
// renders an arbitrary section shape), an event's fields are known and
// real-world (a date, a venue, ticket-style copy), so a hand-built form with
// the right input types (datetime-local, textarea sizing) reads more clearly
// than a generic object-field renderer would for this one collection.
export default function EventForm({ id, initialData, published: initialPublished = true }) {
  const router = useRouter();
  const [data, setData] = useState(() => ({ ...emptyEvent, ...initialData }));
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

    const url = id ? `/api/admin/events/${id}` : "/api/admin/events";
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
    router.push("/admin/events");
    router.refresh();
  }

  async function handleDelete() {
    if (!id || !window.confirm(`Delete "${data.title}"? This can't be undone.`)) return;
    setDeleting(true);
    const response = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setDeleting(false);
    if (response.ok) {
      router.push("/admin/events");
      router.refresh();
    } else {
      setMessage("Failed to delete.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Category
          <input
            type="text"
            value={data.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="e.g. Cultural Night"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Title
          <input
            type="text"
            required
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Date &amp; time
          <input
            type="datetime-local"
            value={isoToLocalInput(data.date)}
            onChange={(e) => set("date", localInputToIso(e.target.value))}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Time label
          <input
            type="text"
            value={data.time}
            onChange={(e) => set("time", e.target.value)}
            placeholder="e.g. 07:30 PM Onwards"
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Venue
          <input
            type="text"
            value={data.venue}
            onChange={(e) => set("venue", e.target.value)}
            className={inputClass}
          />
        </label>
        {id ? (
          <label className="flex items-center gap-2.5 self-end pb-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="size-4 rounded border-gray-300 text-maroon focus:ring-gold/40"
            />
            Published (visible on the public site)
          </label>
        ) : null}
      </div>

      <ImageUploadField label="Image" value={data.image} onChange={(v) => set("image", v)} />

      <label className={labelClass}>
        Summary <span className="normal-case text-gray-600">(shown on the card)</span>
        <textarea
          value={data.summary}
          onChange={(e) => set("summary", e.target.value)}
          rows={2}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Description <span className="normal-case text-gray-600">(shown in the details popup)</span>
        <textarea
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className={inputClass}
        />
      </label>

      <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-maroon px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-maroon-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {saving ? "Saving…" : id ? "Save changes" : "Create event"}
        </button>
        {id ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete event"}
          </button>
        ) : null}
        {message ? <span className="text-sm text-red-500">{message}</span> : null}
      </div>
    </form>
  );
}

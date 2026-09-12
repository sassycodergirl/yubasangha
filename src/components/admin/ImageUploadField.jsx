"use client";

import { useState } from "react";

// Small file picker + preview, alongside the raw URL/path field (still
// editable by hand for an existing /public asset). Uploads go through
// /api/admin/upload to Supabase Storage and the returned public URL fills
// the field. Shared by AutoForm (section content) and EventForm (the Events
// collection) so upload behaviour stays identical in both.
const inputClass =
  "mt-1.5 w-full rounded-xl border border-gold bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all focus:border-gold focus:shadow-[0_0_0_4px_rgba(201,154,59,0.12)]";
const fieldLabelClass = "block text-xs font-medium uppercase tracking-[0.06em] text-gray-700";

export default function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const str = value ?? "";

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const result = await response.json().catch(() => ({}));

    setUploading(false);
    if (!response.ok) {
      setError(result.error || "Upload failed.");
      return;
    }
    onChange(result.url);
  }

  return (
    <div>
      {label ? <label className={fieldLabelClass}>{label}</label> : null}
      <div className="mt-1.5 flex items-start gap-3">
        {str ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-chosen/uploaded URL
          <img
            src={str}
            alt=""
            className="size-14 shrink-0 rounded-xl border border-gold object-cover shadow-sm"
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-gold text-[10px] text-gray-600">
            No image
          </div>
        )}

        <div className="flex-1">
          <input
            type="text"
            value={str}
            onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
            placeholder="/public path or uploaded URL"
            className={inputClass}
          />
          <div className="mt-1.5 flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center text-xs font-medium text-maroon hover:text-maroon-dark hover:underline">
              {uploading ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
                disabled={uploading}
              />
            </label>
            {error ? <span className="text-xs text-red-500">{error}</span> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

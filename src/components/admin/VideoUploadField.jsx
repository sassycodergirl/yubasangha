"use client";

import { useState } from "react";

// Same upload flow as ImageUploadField (POSTs to /api/admin/upload, which
// now accepts video files too -- see that route), but for Pujo Sangbad's
// "upload your own" option specifically. Deliberately shown as the
// secondary choice next to the Video URL field, with a clear storage
// warning: every other video feature on the site (Gallery, Pujo Sangbad's
// own `videoUrl`) links out to YouTube/Facebook/Instagram and costs this
// site nothing to host -- an uploaded file is the one path that actually
// consumes this project's own storage quota, so an admin should reach for
// it only when there's genuinely no public post to link to instead.
const inputClass =
  "mt-1.5 w-full rounded-xl border border-gold bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all focus:border-gold focus:shadow-[0_0_0_4px_rgba(201,154,59,0.12)]";
const fieldLabelClass = "block text-xs font-medium uppercase tracking-[0.06em] text-gray-700";

export default function VideoUploadField({ label, value, onChange }) {
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
      <div className="mt-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
        <strong className="font-semibold">Storage warning:</strong> an uploaded video is stored on this
        site, not linked out — it will use up storage space (an external YouTube, Facebook, or
        Instagram link above uses none). Prefer a link whenever the video is already posted
        somewhere public.
      </div>

      <div className="mt-2 flex items-start gap-3">
        {str ? (
          <video src={str} muted className="size-14 shrink-0 rounded-xl border border-gold object-cover shadow-sm" />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-gold text-center text-[9px] leading-tight text-gray-600">
            No video
          </div>
        )}

        <div className="flex-1">
          <input
            type="text"
            value={str}
            onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
            placeholder="Uploaded video URL (filled in automatically once uploaded)"
            className={inputClass}
          />
          <div className="mt-1.5 flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center text-xs font-medium text-maroon hover:text-maroon-dark hover:underline">
              {uploading ? "Uploading…" : "Upload video"}
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
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

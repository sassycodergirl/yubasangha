"use client";

import { useState } from "react";
import { CheckIcon, RefreshIcon } from "@/components/ui/icons";

// Public pages are statically cached -- an admin's save updates the
// database immediately, but the live site keeps serving its last-cached
// HTML until this button is clicked (see /api/revalidate). Deliberately a
// separate, explicit step rather than auto-publishing on every save: it
// lets an admin make several edits and go live with all of them at once,
// and keeps every page render fast (no DB hit per visitor) the rest of the
// time.
export default function PublishChangesButton() {
  const [status, setStatus] = useState("idle"); // idle | publishing | published | error

  async function handlePublish() {
    setStatus("publishing");
    const response = await fetch("/api/revalidate", { method: "POST" });
    setStatus(response.ok ? "published" : "error");
    if (response.ok) setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <button
      type="button"
      onClick={handlePublish}
      disabled={status === "publishing"}
      className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        status === "published"
          ? "bg-green-600 text-white"
          : status === "error"
            ? "bg-red-600 text-white"
            : "bg-maroon text-white hover:bg-maroon-dark"
      }`}
    >
      {status === "published" ? (
        <>
          <CheckIcon className="size-4" />
          Published
        </>
      ) : status === "error" ? (
        "Failed — try again"
      ) : (
        <>
          <RefreshIcon className={`size-4 ${status === "publishing" ? "animate-spin" : ""}`} />
          {status === "publishing" ? "Publishing…" : "Publish Changes"}
        </>
      )}
    </button>
  );
}

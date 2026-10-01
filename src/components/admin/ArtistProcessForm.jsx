"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { PlusIcon } from "@/components/ui/icons";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-gold bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all focus:border-gold focus:shadow-[0_0_0_4px_rgba(201,154,59,0.12)]";
const labelClass = "block text-xs font-medium uppercase tracking-[0.06em] text-gray-700";

const emptyStep = { number: "", title: "", description: "" };
const emptyRow = { heading: "", body: "", image: null, imageEnabled: false, imageColumn: 6 };

function StepEditor({ step, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-gold bg-white p-3.5 sm:grid-cols-[80px_1fr_auto] sm:items-start">
      <label>
        <span className={labelClass}>No.</span>
        <input
          type="text"
          value={step.number}
          onChange={(e) => onChange({ ...step, number: e.target.value })}
          placeholder="01"
          className={inputClass}
        />
      </label>
      <div className="space-y-3">
        <label>
          <span className={labelClass}>Title</span>
          <input
            type="text"
            value={step.title}
            onChange={(e) => onChange({ ...step, title: e.target.value })}
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Description</span>
          <textarea
            value={step.description}
            onChange={(e) => onChange({ ...step, description: e.target.value })}
            rows={2}
            className={inputClass}
          />
        </label>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="h-[42px] shrink-0 rounded-xl border border-red-200 px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 sm:mt-5"
      >
        Remove
      </button>
    </div>
  );
}

function RowEditor({ row, onChange, onRemove }) {
  return (
    <div className="space-y-4 rounded-xl border border-gold bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <label className="flex-1">
          <span className={labelClass}>Heading</span>
          <input
            type="text"
            value={row.heading}
            onChange={(e) => onChange({ ...row, heading: e.target.value })}
            className={inputClass}
          />
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="mt-5 shrink-0 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          Remove
        </button>
      </div>

      <RichTextEditor label="Body" value={row.body} onChange={(body) => onChange({ ...row, body })} />

      <label className="flex items-center gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          checked={row.imageEnabled}
          onChange={(e) => onChange({ ...row, imageEnabled: e.target.checked })}
          className="size-4 rounded border-gray-300 text-maroon focus:ring-gold/40"
        />
        Include an image with this row
      </label>

      {row.imageEnabled ? (
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <label className="block">
            <span className={labelClass}>Image Width</span>
            <select
              value={row.imageColumn}
              onChange={(e) => onChange({ ...row, imageColumn: Number(e.target.value) })}
              className={inputClass}
            >
              <option value={6}>Half width -- beside the text (6 / 12 columns)</option>
              <option value={12}>Full width -- above the text (12 / 12 columns)</option>
            </select>
          </label>
          <ImageUploadField label="Image" value={row.image} onChange={(image) => onChange({ ...row, image })} />
        </div>
      ) : null}
    </div>
  );
}

// "Behind The Craft" admin screen -- replaces the generic AutoForm for this
// one section (see artist-process in src/lib/admin/sections.js, dispatched
// to this form instead in src/app/admin/pages/[page]/[section]/page.js).
// Same reasoning as MapForm.jsx: this section has two independently-shaped,
// independently-toggleable pieces (a numbered card row, and a free-form
// rich-text-plus-image block) that the generic field-by-field renderer
// can't offer a good UI for.
export default function ArtistProcessForm({ slug, initialData }) {
  const router = useRouter();
  const [data, setData] = useState(() => structuredClone(initialData));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function set(key, value) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function updateStep(index, next) {
    const steps = data.steps.slice();
    steps[index] = next;
    set("steps", steps);
  }
  function removeStep(index) {
    set(
      "steps",
      data.steps.filter((_, i) => i !== index)
    );
  }
  function addStep() {
    set("steps", [...data.steps, { ...emptyStep }]);
  }

  function updateRow(index, next) {
    const rows = data.contentRows.slice();
    rows[index] = next;
    set("contentRows", rows);
  }
  function removeRow(index) {
    set(
      "contentRows",
      data.contentRows.filter((_, i) => i !== index)
    );
  }
  function addRow() {
    set("contentRows", [...data.contentRows, { ...emptyRow }]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch(`/api/admin/content/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });

    setSaving(false);
    setMessage(response.ok ? "Saved." : "Failed to save.");
    if (response.ok) router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className={labelClass}>Sub Title</span>
          <input
            type="text"
            value={data.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Title Line 1</span>
          <input
            type="text"
            value={data.title[0]}
            onChange={(e) => set("title", [e.target.value, data.title[1]])}
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Title Line 2</span>
          <input
            type="text"
            value={data.title[1]}
            onChange={(e) => set("title", [data.title[0], e.target.value])}
            className={inputClass}
          />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Description</span>
          <textarea
            value={data.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className={inputClass}
          />
        </label>
      </div>

      {/* Card row */}
      <div className="border-t border-gray-100 pt-6">
        <label className="flex items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={data.cardsEnabled}
            onChange={(e) => set("cardsEnabled", e.target.checked)}
            className="size-4 rounded border-gray-300 text-maroon focus:ring-gold/40"
          />
          Show the numbered card row
        </label>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-gray-700">
            Cards ({data.steps.length})
          </p>
          <button
            type="button"
            onClick={addStep}
            className="inline-flex items-center gap-1.5 rounded-lg border border-maroon/20 bg-maroon/5 px-3 py-1.5 text-xs font-medium text-maroon transition-colors hover:border-maroon/40 hover:bg-maroon/10"
          >
            <PlusIcon className="size-3.5" />
            Add card
          </button>
        </div>
        <div className="mt-3 space-y-2.5">
          {data.steps.map((step, i) => (
            <StepEditor key={i} step={step} onChange={(next) => updateStep(i, next)} onRemove={() => removeStep(i)} />
          ))}
        </div>
      </div>

      {/* Content rows */}
      <div className="border-t border-gray-100 pt-6">
        <label className="flex items-center gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={data.contentEnabled}
            onChange={(e) => set("contentEnabled", e.target.checked)}
            className="size-4 rounded border-gray-300 text-maroon focus:ring-gold/40"
          />
          Show the content section below the cards
        </label>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-gray-700">
            Content Rows ({data.contentRows.length})
          </p>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1.5 rounded-lg border border-maroon/20 bg-maroon/5 px-3 py-1.5 text-xs font-medium text-maroon transition-colors hover:border-maroon/40 hover:bg-maroon/10"
          >
            <PlusIcon className="size-3.5" />
            Add row
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-600">
          Each row is its own heading + rich text, with an optional image -- half-width beside the text,
          or full-width above it. No image (or full-width) means the text takes the whole row.
        </p>

        <div className="mt-4 space-y-4">
          {data.contentRows.map((row, i) => (
            <RowEditor key={i} row={row} onChange={(next) => updateRow(i, next)} onRemove={() => removeRow(i)} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
        <label>
          <span className={labelClass}>CTA Label</span>
          <input
            type="text"
            value={data.cta?.label ?? ""}
            onChange={(e) => set("cta", { ...(data.cta ?? {}), label: e.target.value })}
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>CTA Link</span>
          <input
            type="text"
            value={data.cta?.href ?? ""}
            onChange={(e) => set("cta", { ...(data.cta ?? {}), href: e.target.value })}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-maroon px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-maroon-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {message ? (
          <span className={`text-sm ${message === "Saved." ? "text-green-600" : "text-red-500"}`}>
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}

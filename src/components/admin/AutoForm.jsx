"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, PlusIcon } from "@/components/ui/icons";
import ImageUploadField from "@/components/admin/ImageUploadField";

// Generic JSON-object form editor: given any object shaped like one of the
// src/lib/<section>.js configs, it renders an editable form for it and PUTs
// the result back to /api/admin/content/[slug] on save. No per-section code
// needed — see src/lib/admin/sections.js for how a new section gets added.

// Exceptions where the plain camelCase-split label reads too tersely (e.g.
// "Nav") -- keyed by the raw JSON key, not the humanized result.
const LABEL_OVERRIDES = {
  nav: "Navigation Menu",
  eyebrow: "Sub Title",
};

function humanize(key) {
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key];
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// A short label for an array item's collapsed header -- first common
// "name-like" field found, so an unopened nav/gallery/sponsor row is still
// identifiable at a glance.
function summarizeItem(item, index) {
  const key = ["label", "title", "name", "eyebrow", "id", "year"].find(
    (k) => typeof item[k] === "string" && item[k].trim()
  );
  return key ? item[key] : `Item ${index + 1}`;
}

function emptyLike(sample) {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return [];
  if (isPlainObject(sample)) {
    return Object.fromEntries(Object.keys(sample).map((key) => [key, emptyLike(sample[key])]));
  }
  return "";
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-gold bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all focus:border-gold focus:shadow-[0_0_0_4px_rgba(201,154,59,0.12)]";
const fieldLabelClass = "block text-xs font-medium uppercase tracking-[0.06em] text-gray-700";
// Excludes "Image Alt" / "Photo Alt" etc. -- those are plain alt-text
// strings, not image paths, even though their label contains "image"/"photo".
const isImageField = (label) => /image|logo|photo|banner|favicon|^src$/i.test(label) && !/alt$/i.test(label);

// Which fields get a full-width row inside a two-column nested grid (arrays,
// nested objects, images, and long text) vs. a compact half-width cell
// (short strings, numbers, booleans) -- e.g. a nav item's Href + Label sit
// side by side, but its (hypothetical) description would still get its own
// full row.
function isWideValue(label, value) {
  if (Array.isArray(value) || isPlainObject(value) || isImageField(label)) return true;
  if (typeof value === "boolean" || typeof value === "number") return false;
  const str = value ?? "";
  return str.length > 60 || /description|body|tagline|content/i.test(label);
}

function LeafField({ label, value, onChange }) {
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="size-4 rounded border-gray-300 text-maroon focus:ring-gold/40"
        />
        {label}
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className={fieldLabelClass}>
        {label}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={inputClass}
        />
      </label>
    );
  }

  if (isImageField(label)) {
    return <ImageUploadField label={label} value={value} onChange={onChange} />;
  }

  // Strings, and fields that are currently null (e.g. a caption not set yet).
  const str = value ?? "";
  const isLong = str.length > 60 || /description|body|tagline|content/i.test(label);
  const commit = (next) => onChange(next === "" ? null : next);

  if (isLong) {
    return (
      <label className={fieldLabelClass}>
        {label}
        <textarea
          value={str}
          onChange={(e) => commit(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </label>
    );
  }

  return (
    <label className={fieldLabelClass}>
      {label}
      <input
        type="text"
        value={str}
        onChange={(e) => commit(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

// Array of strings/numbers — edited as one item per line. Keeps its own text
// buffer while typing so a freshly-typed blank line doesn't get stripped out
// before the next item is entered; the array only gets re-split on blur.
function ArrayOfPrimitives({ label, value, onChange }) {
  const [text, setText] = useState(value.join("\n"));

  function commit() {
    onChange(
      text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    );
  }

  return (
    <label className={fieldLabelClass}>
      {label} <span className="normal-case text-gray-600">(one per line)</span>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        rows={Math.max(3, value.length)}
        className={inputClass}
      />
    </label>
  );
}

// Array of plain image paths/URLs (e.g. a two-photo collage) -- each slot
// gets its own upload button instead of the one-per-line text box
// ArrayOfPrimitives would otherwise render, which had no way to actually
// upload an image into a `null` slot.
function ArrayOfImages({ label, value, onChange }) {
  function updateItem(index, next) {
    const copy = value.slice();
    copy[index] = next;
    onChange(copy);
  }
  function removeItem(index) {
    onChange(value.filter((_, i) => i !== index));
  }
  function addItem() {
    onChange([...value, null]);
  }

  return (
    <div>
      <p className={fieldLabelClass}>
        {label} <span className="normal-case text-gray-600">({value.length})</span>
      </p>
      <div className="mt-2 space-y-3">
        {value.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <ImageUploadField value={item} onChange={(next) => updateItem(index, next)} />
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="mt-4 shrink-0 text-xs font-medium text-red-500 hover:text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-maroon/20 bg-maroon/5 px-3 py-1.5 text-xs font-medium text-maroon transition-colors hover:border-maroon/40 hover:bg-maroon/10"
      >
        <PlusIcon className="size-3.5" />
        Add image
      </button>
    </div>
  );
}

// Collapsed by default, at both levels -- a section with a dozen nav links,
// gallery images, or sponsors was making the whole edit page absurdly long
// otherwise. The whole list (e.g. "Nav") is one collapsed row until opened;
// each item inside then expands independently (accordion-style, not
// one-at-a-time) so comparing two open items side by side still works.
function ArrayOfObjects({ label, value, onChange }) {
  const [groupOpen, setGroupOpen] = useState(false);
  const [openIndexes, setOpenIndexes] = useState(() => new Set());

  function toggle(index) {
    setOpenIndexes((current) => {
      const next = new Set(current);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }
  function updateItem(index, next) {
    const copy = value.slice();
    copy[index] = next;
    onChange(copy);
  }
  function removeItem(index) {
    onChange(value.filter((_, i) => i !== index));
  }
  function addItem() {
    onChange([...value, emptyLike(value[0] ?? {})]);
    setOpenIndexes((current) => new Set(current).add(value.length));
  }

  return (
    // Bordered card at the group level too (same treatment as a nested
    // object's fieldset) -- otherwise a collapsed array header sat flush
    // against whatever field came before it with nothing to show it's a
    // separate, self-contained group.
    <div className="overflow-hidden rounded-xl border border-gold bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setGroupOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 p-4 text-left transition-colors hover:bg-gray-50"
      >
        <span className="text-xs font-medium uppercase tracking-[0.06em] text-gray-700">
          {label} <span className="normal-case text-gray-600">({value.length})</span>
        </span>
        <ChevronDownIcon
          className={`size-4 shrink-0 text-gray-600 transition-transform ${groupOpen ? "rotate-180" : ""}`}
        />
      </button>
      {groupOpen ? (
        <div className="border-t border-gold bg-gray-50/50 p-4">
          <div className="space-y-2.5">
            {value.map((item, index) => {
              const open = openIndexes.has(index);
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-gold bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3 p-3">
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <ChevronDownIcon
                        className={`size-4 shrink-0 text-gray-600 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                      <span className="truncate text-sm font-medium text-ink">
                        {summarizeItem(item, index)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="shrink-0 text-xs font-medium text-red-500 hover:text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  {open ? (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                      <ObjectFields value={item} onChange={(next) => updateItem(index, next)} nested />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-maroon/20 bg-maroon/5 px-3 py-1.5 text-xs font-medium text-maroon transition-colors hover:border-maroon/40 hover:bg-maroon/10"
          >
            <PlusIcon className="size-3.5" />
            Add item
          </button>
        </div>
      ) : null}
    </div>
  );
}

function FieldRouter({ label, value, onChange }) {
  if (Array.isArray(value)) {
    const isObjectList = value.length > 0 && value.every(isPlainObject);
    if (isObjectList) return <ArrayOfObjects label={label} value={value} onChange={onChange} />;
    if (isImageField(label)) return <ArrayOfImages label={label} value={value} onChange={onChange} />;
    return <ArrayOfPrimitives label={label} value={value} onChange={onChange} />;
  }

  if (isPlainObject(value)) {
    return (
      <div className="rounded-xl border border-gold bg-white p-4 shadow-sm">
        <p className="mb-2.5 text-xs font-medium uppercase tracking-[0.06em] text-gray-700">{label}</p>
        <ObjectFields value={value} onChange={onChange} nested />
      </div>
    );
  }

  return <LeafField label={label} value={value} onChange={onChange} />;
}

// Top-level (a whole section's fields): one full-width column, each field
// separated by a hairline divider so e.g. "Logo" reads as clearly distinct
// from the "Nav" card below it. Nested (a fieldset, or one item inside an
// ArrayOfObjects): a two-column grid, with wide fields (see isWideValue)
// spanning both columns.
function ObjectFields({ value, onChange, nested = false }) {
  return (
    <div className={nested ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "divide-y divide-gray-100"}>
      {Object.entries(value).map(([key, val]) => {
        const label = humanize(key);
        return (
          <div
            key={key}
            className={
              nested
                ? isWideValue(label, val)
                  ? "sm:col-span-2"
                  : undefined
                : "py-5 first:pt-0 last:pb-0"
            }
          >
            <FieldRouter label={label} value={val} onChange={(next) => onChange({ ...value, [key]: next })} />
          </div>
        );
      })}
    </div>
  );
}

export default function AutoForm({ slug, initialData }) {
  const router = useRouter();
  const [data, setData] = useState(() => cloneDeep(initialData));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <ObjectFields value={data} onChange={setData} />
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

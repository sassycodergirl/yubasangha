"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useNaturalAspectRatio } from "@/lib/useNaturalAspectRatio";
import {
  PlusIcon,
  CloseIcon,
  EntryIcon,
  ExitDoorIcon,
  StarIcon,
  BhogIcon,
  DropletIcon,
  FirstAidIcon,
  ForkKnifeIcon,
  BalloonIcon,
  ParkingIcon,
  WheelchairIcon,
  CameraIcon,
  RunExitIcon,
} from "@/components/ui/icons";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-gold bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-all focus:border-gold focus:shadow-[0_0_0_4px_rgba(201,154,59,0.12)]";
const labelClass = "block text-xs font-medium uppercase tracking-[0.06em] text-gray-700";

// Same fixed glyph set PandalMap.jsx's own ICONS map uses -- kept here only
// as a labeled dropdown so a category's `icon` is always one of these keys,
// never a typo.
const ICON_OPTIONS = [
  { value: "entry", label: "Entry", Icon: EntryIcon },
  { value: "exit", label: "Exit", Icon: ExitDoorIcon },
  { value: "vip", label: "Star / VIP", Icon: StarIcon },
  { value: "bhog", label: "Bhog", Icon: BhogIcon },
  { value: "washroom", label: "Washroom", Icon: DropletIcon },
  { value: "firstaid", label: "First Aid", Icon: FirstAidIcon },
  { value: "food", label: "Food", Icon: ForkKnifeIcon },
  { value: "kids", label: "Kids Zone", Icon: BalloonIcon },
  { value: "parking", label: "Parking", Icon: ParkingIcon },
  { value: "wheelchair", label: "Wheelchair", Icon: WheelchairIcon },
  { value: "camera", label: "Camera / Selfie", Icon: CameraIcon },
  { value: "emergency", label: "Emergency Exit", Icon: RunExitIcon },
];

function slugify(label) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Unique id for a new category/pin -- slugified from the label when
// possible (categories), with a short random suffix if that's already
// taken, or just a short random id (pins, which have no label of their
// own).
function uniqueId(base, taken) {
  if (base && !taken.has(base)) return base;
  let candidate = base;
  do {
    candidate = `${base || "item"}-${Math.random().toString(36).slice(2, 6)}`;
  } while (taken.has(candidate));
  return candidate;
}

// Selecting this sends the dropdown into "custom" mode -- not a real icon
// key, just a sentinel this form recognizes. An unrecognized `icon` string
// (anything not one of ICON_OPTIONS' values, including "" for a category
// that's picked "custom" but not uploaded one yet) means "custom" too, so a
// category someone already gave a custom icon still shows the uploader
// (and its preview) the next time this form loads, without needing to
// store that choice separately.
const CUSTOM_ICON_VALUE = "__custom__";
const isBuiltInIcon = (icon) => ICON_OPTIONS.some((opt) => opt.value === icon);

function CategoryRow({ category, onChange, onRemove }) {
  const customMode = !isBuiltInIcon(category.icon);

  return (
    <div className="rounded-xl border border-gold bg-white p-3.5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
        <label className={labelClass}>
          Label
          <input
            type="text"
            value={category.label}
            onChange={(e) => onChange({ ...category, label: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Icon
          <select
            value={customMode ? CUSTOM_ICON_VALUE : category.icon}
            onChange={(e) =>
              onChange({ ...category, icon: e.target.value === CUSTOM_ICON_VALUE ? "" : e.target.value })
            }
            className={inputClass}
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            <option value={CUSTOM_ICON_VALUE}>Custom (upload image)</option>
          </select>
        </label>
        <label className={labelClass}>
          Color
          <input
            type="color"
            value={category.color}
            onChange={(e) => onChange({ ...category, color: e.target.value })}
            className="mt-1.5 h-[42px] w-16 cursor-pointer rounded-xl border border-gold bg-white p-1"
          />
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="h-[42px] shrink-0 rounded-xl border border-red-200 px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          Remove
        </button>
      </div>

      {customMode ? (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <ImageUploadField
            label="Custom Icon"
            value={category.icon || null}
            onChange={(url) => onChange({ ...category, icon: url ?? "" })}
          />
        </div>
      ) : null}
    </div>
  );
}

// Click (or tap) the map to drop a new pin for whichever category is
// selected above it; drag an existing pin's marker to reposition it; click
// an existing marker (without dragging) to select it -- a small red "x"
// badge appears right on it for a quick removal, and the panel below gets
// a dropdown for reassigning its category instead. All of this writes
// straight into `pins`' x/y as a percentage of the image, same as
// PandalMap.jsx reads -- no admin ever has to know what "x: 55, y: 60"
// means.
function InteractivePinMap({
  mapImage,
  categories,
  pins,
  onChangePins,
  activeCategoryId,
  selectedPinId,
  onSelectPin,
  onRemovePin,
}) {
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  // Matches the image's own aspect ratio exactly (falls back to a 4:3 guess
  // for the instant before it loads) -- see useNaturalAspectRatio's comment
  // for why this is what makes a pin placed here land on the same spot on
  // the public site, not just somewhere close.
  const ratio = useNaturalAspectRatio(mapImage);

  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

  function percentFromEvent(e) {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.round(Math.min(100, Math.max(0, x))), y: Math.round(Math.min(100, Math.max(0, y))) };
  }

  function handleBackgroundClick(e) {
    if (dragRef.current?.moved) {
      dragRef.current = null;
      return; // a drag just ended on the background -- not a new-pin click
    }
    if (dragRef.current) return; // a plain click on a pin (see handlePinPointerDown) -- not the background
    if (!activeCategoryId) return;
    const { x, y } = percentFromEvent(e);
    const id = uniqueId("p", new Set(pins.map((p) => p.id)));
    onChangePins([...pins, { id, categoryId: activeCategoryId, x, y }]);
    onSelectPin(id);
  }

  function handlePinPointerDown(pinId, e) {
    e.stopPropagation();
    dragRef.current = { pinId, moved: false };
    onSelectPin(pinId);

    function onMove(moveEvent) {
      dragRef.current.moved = true;
      const { x, y } = percentFromEvent(moveEvent);
      onChangePins(pins.map((p) => (p.id === pinId ? { ...p, x, y } : p)));
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      // Clear the "just dragged" flag on a short delay so the subsequent
      // click event on the container (pointerup fires before click) still
      // sees it and skips adding a new pin.
      setTimeout(() => {
        dragRef.current = null;
      }, 0);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div
      ref={containerRef}
      onClick={handleBackgroundClick}
      className={`relative w-full overflow-hidden rounded-2xl border-2 border-gold bg-gray-100 ${
        activeCategoryId ? "cursor-crosshair" : "cursor-default"
      }`}
      style={{ aspectRatio: ratio ?? 4 / 3 }}
    >
      {mapImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- natural pixel mapping for click-to-place math, not a Next/Image fill box
        <img src={mapImage} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
          Upload a map image above first.
        </div>
      )}

      {pins.map((pin) => {
        const category = categoryById[pin.categoryId];
        const selected = pin.id === selectedPinId;
        return (
          <div
            key={pin.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <button
              type="button"
              onPointerDown={(e) => handlePinPointerDown(pin.id, e)}
              onClick={(e) => e.stopPropagation()}
              style={{ backgroundColor: category?.color ?? "#999" }}
              className={`flex size-7 cursor-grab items-center justify-center rounded-full border-2 text-[10px] font-bold text-white shadow-md transition-transform active:cursor-grabbing ${
                selected ? "z-20 scale-125 border-ink" : "z-10 border-white/90 hover:scale-110"
              }`}
              title={category?.label ?? pin.categoryId}
            />
            {selected ? (
              // Quick-remove right on the pin itself -- no need to find the
              // panel below for the common case of just deleting it.
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemovePin(pin.id);
                }}
                aria-label="Remove this pin"
                title="Remove this pin"
                className="absolute -right-1.5 -top-1.5 z-30 flex size-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-white shadow-md hover:bg-red-600"
              >
                <CloseIcon className="size-3" />
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// Pandal Map admin screen -- replaces the generic AutoForm for this one
// section. AutoForm's plain fields-in-order rendering worked fine for
// Title/Tagline/CTA/Map Image, but fell apart for `pins`: each one is just
// {id, categoryId, x, y}, which meant an admin saw a wall of identical
// "Item N" rows and had to open every single one to find a given pin, type
// a raw percentage by hand with no feedback, and freely mistype a
// `categoryId` that matched nothing. This hand-built version fixes all
// three: pins are placed by clicking/dragging directly on the map image
// (see InteractivePinMap above), and a pin's category is always chosen from
// a dropdown built from whatever's currently in `categories` -- no separate
// "save categories first" step needed, since that list already lives in
// this same in-memory `data` as the admin edits it.
export default function MapForm({ slug, initialData }) {
  const router = useRouter();
  const [data, setData] = useState(() => structuredClone(initialData));
  const [activeCategoryId, setActiveCategoryId] = useState(data.categories[0]?.id ?? null);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function set(key, value) {
    setData((current) => ({ ...current, [key]: value }));
  }

  function updateCategory(index, next) {
    const categories = data.categories.slice();
    const prevId = categories[index].id;
    const nextId = uniqueId(slugify(next.label) || prevId, new Set(categories.map((c, i) => (i === index ? null : c.id))));
    categories[index] = { ...next, id: nextId };
    // Keep every pin pointing at this category in sync if its id changed
    // (relabeling "Food Court" shouldn't silently orphan its pins).
    const pins = nextId === prevId ? data.pins : data.pins.map((p) => (p.categoryId === prevId ? { ...p, categoryId: nextId } : p));
    setData((current) => ({ ...current, categories, pins }));
    if (activeCategoryId === prevId) setActiveCategoryId(nextId);
  }

  function addCategory() {
    const id = uniqueId("category", new Set(data.categories.map((c) => c.id)));
    const next = { id, label: "New Category", color: "#c99a3b", icon: "entry" };
    setData((current) => ({ ...current, categories: [...current.categories, next] }));
    setActiveCategoryId(id);
  }

  function removeCategory(index) {
    const category = data.categories[index];
    const affectedPins = data.pins.filter((p) => p.categoryId === category.id).length;
    if (
      affectedPins > 0 &&
      !window.confirm(`"${category.label}" is used by ${affectedPins} pin(s). Remove it and those pins too?`)
    ) {
      return;
    }
    setData((current) => ({
      ...current,
      categories: current.categories.filter((_, i) => i !== index),
      pins: current.pins.filter((p) => p.categoryId !== category.id),
    }));
    if (activeCategoryId === category.id) {
      setActiveCategoryId(data.categories.find((c) => c.id !== category.id)?.id ?? null);
    }
  }

  function removePin(pinId) {
    setData((current) => ({ ...current, pins: current.pins.filter((p) => p.id !== pinId) }));
    setSelectedPinId((current) => (current === pinId ? null : current));
  }
  function removeSelectedPin() {
    if (!selectedPinId) return;
    removePin(selectedPinId);
  }

  // For starting over on placeholder/sample pins -- wipes every pin so an
  // admin can place real ones from scratch instead of deleting a dozen
  // "Item N" rows by hand one at a time.
  function clearAllPins() {
    if (!window.confirm(`Remove all ${data.pins.length} pins? This can't be undone until you save.`)) return;
    setData((current) => ({ ...current, pins: [] }));
    setSelectedPinId(null);
  }

  function reassignSelectedPin(categoryId) {
    setData((current) => ({
      ...current,
      pins: current.pins.map((p) => (p.id === selectedPinId ? { ...p, categoryId } : p)),
    }));
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

  const selectedPin = data.pins.find((p) => p.id === selectedPinId) ?? null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Title Line 1
          <input
            type="text"
            value={data.title[0]}
            onChange={(e) => set("title", [e.target.value, data.title[1]])}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Title Line 2
          <input
            type="text"
            value={data.title[1]}
            onChange={(e) => set("title", [data.title[0], e.target.value])}
            className={inputClass}
          />
        </label>
        <label className="sm:col-span-2">
          <span className={labelClass}>Tagline</span>
          <input
            type="text"
            value={data.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          CTA Label
          <input
            type="text"
            value={data.cta.label}
            onChange={(e) => set("cta", { ...data.cta, label: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          CTA Link
          <input
            type="text"
            value={data.cta.href}
            onChange={(e) => set("cta", { ...data.cta, href: e.target.value })}
            className={inputClass}
          />
        </label>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <ImageUploadField label="Map Image" value={data.mapImage} onChange={(url) => set("mapImage", url)} />
      </div>

      {/* Categories */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-gray-700">
            Categories ({data.categories.length})
          </p>
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-1.5 rounded-lg border border-maroon/20 bg-maroon/5 px-3 py-1.5 text-xs font-medium text-maroon transition-colors hover:border-maroon/40 hover:bg-maroon/10"
          >
            <PlusIcon className="size-3.5" />
            Add category
          </button>
        </div>
        <div className="mt-3 space-y-2.5">
          {data.categories.map((category, i) => (
            <CategoryRow
              key={category.id}
              category={category}
              onChange={(next) => updateCategory(i, next)}
              onRemove={() => removeCategory(i)}
            />
          ))}
        </div>
      </div>

      {/* Interactive pins */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-gray-700">
            Pins ({data.pins.length})
          </p>
          {data.pins.length > 0 ? (
            <button
              type="button"
              onClick={clearAllPins}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <CloseIcon className="size-3.5" />
              Clear all pins
            </button>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-gray-600">
          Pick a category, then click the map to drop a pin there. Drag any pin to move it; click one to
          reassign or remove it below.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={labelClass}>Placing:</span>
          {data.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              style={activeCategoryId === category.id ? { borderColor: category.color, color: category.color } : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategoryId === category.id ? "bg-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <span className="size-2.5 rounded-full" style={{ backgroundColor: category.color }} />
              {category.label}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <InteractivePinMap
            mapImage={data.mapImage}
            categories={data.categories}
            pins={data.pins}
            onChangePins={(pins) => set("pins", pins)}
            activeCategoryId={activeCategoryId}
            selectedPinId={selectedPinId}
            onSelectPin={setSelectedPinId}
            onRemovePin={removePin}
          />
        </div>

        {selectedPin ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-gold bg-gray-50/50 p-3.5">
            <span className="text-xs font-medium uppercase tracking-[0.06em] text-gray-700">
              Selected pin:
            </span>
            <select
              value={selectedPin.categoryId}
              onChange={(e) => reassignSelectedPin(e.target.value)}
              className="rounded-lg border border-gold bg-white px-3 py-1.5 text-sm text-ink outline-none"
            >
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-500">
              x: {selectedPin.x}%, y: {selectedPin.y}%
            </span>
            <button
              type="button"
              onClick={removeSelectedPin}
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 hover:underline"
            >
              <CloseIcon className="size-3.5" />
              Remove pin
            </button>
          </div>
        ) : null}
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

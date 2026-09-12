"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import {
  StarIcon,
  EntryIcon,
  ExitDoorIcon,
  BhogIcon,
  DropletIcon,
  FirstAidIcon,
  ForkKnifeIcon,
  BalloonIcon,
  ParkingIcon,
  WheelchairIcon,
  CameraIcon,
  RunExitIcon,
  PlusIcon,
  MinusIcon,
} from "@/components/ui/icons";

// Maps the `icon` key stored per category (src/lib/map.js) to its glyph --
// same set the homepage's PandalMap uses.
const ICONS = {
  entry: EntryIcon,
  exit: ExitDoorIcon,
  vip: StarIcon,
  bhog: BhogIcon,
  washroom: DropletIcon,
  firstaid: FirstAidIcon,
  food: ForkKnifeIcon,
  kids: BalloonIcon,
  parking: ParkingIcon,
  wheelchair: WheelchairIcon,
  camera: CameraIcon,
  emergency: RunExitIcon,
};

const MIN_SCALE = 1;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.4;
const PIN_FOCUS_SCALE = 1.8; // zoom level used to "take you to" a selected pin

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// Map page's own take on the homepage's PandalMap -- same pan/zoom/pin
// interaction, but restructured for the room a dedicated page has: the map
// gets a large, clean card of its own (nothing overlaid on top of it other
// than a pin's own tooltip), and the title/tagline/legend live in a
// separate panel beside it instead of floating over the map with gradient
// scrims. Reuses the same `map` content block the homepage section edits
// (the homepage itself keeps its own original overlay design, unchanged).
export default function PandalMapExplorer({ content }) {
  const { title, tagline, mapImage, categories, pins } = content;
  const [activePinId, setActivePinId] = useState(null);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);

  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
  const activePin = pins.find((p) => p.id === activePinId) ?? null;
  const activeCategory = activePin ? categoryById[activePin.categoryId] : null;

  // Keeps the map from being panned past its own edge -- at a given scale,
  // the layer is `scale` times the viewport's size, centered, so the valid
  // offset range either side is exactly half of the extra size.
  const clampPan = useCallback((x, y, scale) => {
    const el = viewportRef.current;
    if (!el) return { x: 0, y: 0 };
    const maxX = (el.clientWidth * (scale - 1)) / 2;
    const maxY = (el.clientHeight * (scale - 1)) / 2;
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  }, []);

  // Selecting a pin (or a legend entry) pans/zooms so it lands centered in
  // the viewport, so picking one from the legend panel visibly "takes you
  // there" on the map instead of just highlighting something off-screen.
  const centerOnPin = useCallback(
    (pin) => {
      const el = viewportRef.current;
      if (!el) return;
      setView((v) => {
        const scale = Math.max(v.scale, PIN_FOCUS_SCALE);
        const targetX = el.clientWidth * (pin.x / 100);
        const targetY = el.clientHeight * (pin.y / 100);
        const tx = scale * (el.clientWidth / 2 - targetX);
        const ty = scale * (el.clientHeight / 2 - targetY);
        return { scale, ...clampPan(tx, ty, scale) };
      });
    },
    [clampPan]
  );

  const selectPin = (pinId) => {
    const next = activePinId === pinId ? null : pinId;
    setActivePinId(next);
    if (next) {
      const pin = pins.find((p) => p.id === next);
      if (pin) centerOnPin(pin);
    }
  };
  const selectCategory = (categoryId) => {
    const pin = pins.find((p) => p.categoryId === categoryId);
    if (pin) selectPin(pin.id);
  };

  const zoomBy = useCallback(
    (delta) => {
      setView((v) => {
        const scale = clamp(v.scale + delta, MIN_SCALE, MAX_SCALE);
        return { scale, ...clampPan(v.x, v.y, scale) };
      });
    },
    [clampPan]
  );

  const resetView = () => setView({ scale: 1, x: 0, y: 0 });

  const onPointerDown = (e) => {
    if (view.scale <= MIN_SCALE) return; // nothing to pan at rest
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: view.x, originY: view.y };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    setView((v) => ({
      ...v,
      ...clampPan(drag.originX + dx, drag.originY + dy, v.scale),
    }));
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const onWheel = (e) => {
    e.preventDefault();
    zoomBy(e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP);
  };

  return (
    <section className="relative overflow-hidden bg-[#d3d1d1] py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          {/* Map: full card of its own, nothing overlaid on it besides a
              selected pin's own small tooltip -- the legend lives entirely
              in the panel beside it instead. */}
          <div
            ref={viewportRef}
            className="relative h-[420px] touch-none select-none overflow-hidden rounded-2xl border-2 border-maroon/30 bg-ink shadow-xl sm:h-[520px] lg:h-[640px]"
            style={{ cursor: view.scale > MIN_SCALE ? (dragging ? "grabbing" : "grab") : "default" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onWheel={onWheel}
          >
            <div
              className="absolute inset-0 transition-transform duration-150 ease-out"
              style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
            >
              <Image
                src={mapImage}
                alt="Illustrated map of the puja pandal"
                fill
                unoptimized
                priority
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="pointer-events-none object-cover"
              />

              {pins.map((pin) => {
                const category = categoryById[pin.categoryId];
                const Icon = ICONS[category.icon] ?? StarIcon;
                const active = pin.id === activePinId;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => selectPin(pin.id)}
                    aria-label={category.label}
                    style={{
                      left: `${pin.x}%`,
                      top: `${pin.y}%`,
                      backgroundColor: category.color,
                      transform: `translate(-50%, -50%) scale(${(active ? 1.3 : 1) / view.scale})`,
                    }}
                    className={`absolute flex size-7 items-center justify-center rounded-full border-2 border-white/85 text-ink shadow-md transition-transform sm:size-8 ${
                      active ? "z-20 ring-4 ring-white/40" : "z-10 hover:brightness-110"
                    }`}
                  >
                    <Icon className="size-3.5 sm:size-4" />
                  </button>
                );
              })}

              {activePin && activeCategory && (
                <div
                  style={{
                    left: `${activePin.x}%`,
                    top: `${activePin.y}%`,
                    transform: `translate(-50%, calc(-100% - ${18 / view.scale}px)) scale(${1 / view.scale})`,
                  }}
                  className="pointer-events-none absolute z-30 origin-bottom whitespace-nowrap rounded-md bg-ink/95 px-3 py-1.5 text-xs font-semibold text-white shadow-lg ring-1 ring-gold/30"
                >
                  {activeCategory.label}
                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink/95" />
                </div>
              )}
            </div>

            {/* Zoom controls -- Google-Maps-style +/- stack */}
            <div className="absolute bottom-5 right-5 z-30 flex flex-col overflow-hidden rounded-lg border border-gold/30 bg-ink/80 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => zoomBy(SCALE_STEP)}
                aria-label="Zoom in"
                disabled={view.scale >= MAX_SCALE}
                className="flex size-9 items-center justify-center text-white transition-colors hover:bg-white/10 disabled:opacity-30"
              >
                <PlusIcon className="size-4" />
              </button>
              <span className="h-px bg-gold/20" />
              <button
                type="button"
                onClick={() => zoomBy(-SCALE_STEP)}
                aria-label="Zoom out"
                disabled={view.scale <= MIN_SCALE}
                className="flex size-9 items-center justify-center text-white transition-colors hover:bg-white/10 disabled:opacity-30"
              >
                <MinusIcon className="size-4" />
              </button>
            </div>
            {view.scale > MIN_SCALE && (
              <button
                type="button"
                onClick={resetView}
                className="absolute bottom-[4.6rem] right-5 z-30 rounded-md border border-gold/30 bg-ink/80 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Reset
              </button>
            )}
          </div>

          {/* Intro + legend -- entirely separate from the map, not overlaid
              on it. */}
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl">
              {title[0]}
              <span className="block text-maroon">{title[1]}</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{tagline}</p>

            <p className="mt-8 text-[11px] uppercase tracking-[0.25em] text-maroon">Map Legend</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {categories.map((category) => {
                const Icon = ICONS[category.icon] ?? StarIcon;
                const isActive = activeCategory?.id === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => selectCategory(category.id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors ${
                      isActive
                        ? "border-maroon bg-maroon/10 text-maroon"
                        : "border-ink/10 bg-white/40 text-ink/70 hover:border-ink/25 hover:text-ink"
                    }`}
                  >
                    <span
                      className="flex size-7 shrink-0 items-center justify-center rounded-full border border-ink/15"
                      style={{ backgroundColor: category.color }}
                    >
                      <Icon className="size-3.5 text-ink" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

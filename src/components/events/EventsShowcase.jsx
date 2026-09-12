"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon, CalendarIcon, CloseIcon, ImageIcon, TempleIcon } from "@/components/ui/icons";
import { getDateLabel, formatFullDate } from "@/lib/dateFormat";

// One event, styled like a ticket stub: a maroon date stub (with punched
// "notches" and a dashed tear line on desktop) beside a photo and the
// event's summary -- distinct from the plain list/timeline treatment
// already used elsewhere on the site (Schedule, About Us), and fitting for
// a page that's specifically about individual, ticketed happenings.
function EventCard({ event, onView, priority = false }) {
  const dateLabel = getDateLabel(event.date);
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl sm:flex-row">
      {/* Date stub */}
      <div className="relative flex shrink-0 items-center justify-center gap-3 bg-maroon px-6 py-4 text-white sm:w-28 sm:flex-col sm:gap-1 sm:py-6">
        <span className="font-display text-3xl font-bold leading-none">{dateLabel.day}</span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-gold-soft">
          {dateLabel.month}
        </span>
        {/* Ticket "punch" notches + tear line -- desktop only, where the
            stub sits beside the rest of the card rather than above it. */}
        <span className="pointer-events-none absolute -right-3 top-0 hidden size-6 -translate-y-1/2 rounded-full bg-[#d3d1d1] sm:block" />
        <span className="pointer-events-none absolute -right-3 bottom-0 hidden size-6 translate-y-1/2 rounded-full bg-[#d3d1d1] sm:block" />
        <span className="pointer-events-none absolute inset-y-3 right-0 hidden border-r-2 border-dashed border-white/30 sm:block" />
      </div>

      {/* Photo */}
      <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-44">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            unoptimized
            priority={priority}
            sizes="(min-width: 640px) 180px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
            <ImageIcon className="size-8 text-gold/60" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-maroon">{event.category}</p>
          <h3 className="mt-1 font-display text-lg font-bold uppercase leading-tight text-ink">
            {event.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">{event.summary}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-ink/60">
            <CalendarIcon className="size-4 text-maroon" />
            {event.time}
          </div>
          <button
            type="button"
            onClick={() => onView(event)}
            className="inline-flex items-center gap-1.5 rounded-full border border-maroon/50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-maroon transition-colors hover:bg-maroon hover:text-white"
          >
            View Details
            <ArrowRightIcon className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EventModal({ event, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      <button type="button" onClick={onClose} aria-label="Close" className="absolute inset-0" />

      <div className="relative z-10 max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-ink/80 text-white transition-colors hover:bg-ink"
        >
          <CloseIcon className="size-4" />
        </button>

        <div className="relative h-56 w-full shrink-0">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              unoptimized
              sizes="32rem"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
              <ImageIcon className="size-10 text-gold/60" />
            </div>
          )}
        </div>

        <div className="p-6 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.25em] text-maroon">{event.category}</p>
          <h3 className="mt-1 font-display text-2xl font-bold uppercase leading-tight text-ink">
            {event.title}
          </h3>

          <div className="mt-4 space-y-2 border-y border-ink/10 py-4 text-sm text-ink/70">
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="size-4 shrink-0 text-maroon" />
              {formatFullDate(event.date)} &middot; {event.time}
            </div>
            <div className="flex items-center gap-2.5">
              <TempleIcon className="size-4 shrink-0 text-maroon" />
              {event.venue}
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink/70">{event.description}</p>
        </div>
      </div>
    </div>
  );
}

// Events page: every event listed as a ticket-style card, with a "View
// Details" button opening the full description/venue/date in a modal --
// distinct from the homepage's single featured-event teaser
// (EventsSponsors.jsx), which links straight to this page instead.
export default function EventsShowcase({ events }) {
  const [selected, setSelected] = useState(null);

  return (
    <section className="relative overflow-hidden bg-[#d3d1d1] py-20 sm:py-28">
      <div className="relative mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <div className="space-y-6">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} onView={setSelected} priority={i === 0} />
          ))}
        </div>
      </div>

      {selected ? <EventModal event={selected} onClose={() => setSelected(null)} /> : null}
    </section>
  );
}

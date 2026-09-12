import Image from "next/image";
import { ImageIcon } from "@/components/ui/icons";

// One ritual: real photo (falls back to a placeholder until an admin
// uploads one) + time/label/description. `reverse` mirrors the row so
// left-side cards on desktop read toward the center line instead of away
// from it.
function EventCard({ event, reverse }) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5 ${
        reverse ? "sm:flex-row-reverse sm:text-right" : "sm:text-left"
      }`}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg border-2 border-gold/70 bg-ink shadow-lg sm:w-44">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.label}
            fill
            unoptimized
            sizes="(min-width: 640px) 11rem, 90vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
            <ImageIcon className="size-8 text-gold/60" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-display text-sm font-bold text-maroon">{event.time}</p>
        <p className="mt-1 font-display text-lg font-bold uppercase tracking-wide text-ink">
          {event.label}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{event.description}</p>
      </div>
    </div>
  );
}

// Schedule page's own take on the day's ritual list -- a zigzag timeline
// (alternating sides on desktop, a single connected column on mobile)
// instead of the homepage's single horizontal row, with real photos per
// ritual instead of icon glyphs. Sits on the shared inner-page intro
// background (#d3d1d1, dark text) per convention.
export default function ScheduleTimeline({ content, events }) {
  const { subtitle, title, description } = content;

  return (
    <section className="relative overflow-hidden bg-[#d3d1d1] py-20 sm:py-28">
      <div className="relative mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-maroon">{subtitle}</p>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl">
            {title[0]}
            <span className="block text-maroon">{title[1]}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink/70">
            {description}
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line: left edge on mobile (a plain vertical list),
              centered on desktop (where cards alternate sides). */}
          <div className="pointer-events-none absolute left-5 top-0 h-full w-px bg-maroon/25 sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-14 sm:space-y-4">
            {events.map((event, i) => {
              const onRight = i % 2 === 1;
              return (
                <div
                  key={event.label}
                  className="relative pl-14 sm:grid sm:min-h-52 sm:grid-cols-2 sm:items-center sm:gap-x-16 sm:pl-0"
                >
                  <span className="absolute left-5 top-2 size-3 -translate-x-1/2 rounded-full border-2 border-maroon bg-[#d3d1d1] sm:left-1/2 sm:top-1/2 sm:-translate-y-1/2" />
                  <div className={onRight ? "sm:col-start-2" : "sm:col-start-1"}>
                    <EventCard event={event} reverse={!onRight} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

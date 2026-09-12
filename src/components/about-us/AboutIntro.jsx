import CornerFrame from "@/components/ui/CornerFrame";
import { DiyaIcon } from "@/components/ui/icons";

// About Us page's own intro: two columns, left copy / right image -- distinct
// from the homepage's About section (which follows right after this one on
// the page and covers legacy stats + the milestone timeline instead). Light
// neutral background (per request), so this section breaks from the shared
// dark `bg-ink` treatment the rest of the site uses -- no
// SectionBackground/SectionBlend here since those are built for dark
// sections.
export default function AboutIntro({ content }) {
  const { subtitle, title, description, image } = content;

  return (
    <section className="relative overflow-hidden bg-[#d3d1d1] py-20 sm:py-28">
      <div className="relative mx-auto grid max-w-[1400px] gap-14 px-6 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-16 xl:px-20">
        {/* Left: copy */}
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.35em] text-maroon">{subtitle}</p>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl">
            {title[0]}
            <span className="block text-maroon">{title[1]}</span>
          </h2>
          <div className="mt-5 max-w-lg space-y-4 text-sm leading-relaxed text-ink/70">
            {description.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Right: image -- shown at its own natural aspect ratio (no forced
            crop box), not a portrait crop. */}
        <div className="relative mx-auto w-full max-w-2xl">
          {image ? (
            <div className="relative overflow-hidden rounded-lg border-[1.5px] border-gold/70 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element -- natural size, not a fixed `fill` box */}
              <img src={image} alt="Telipukur Yuba Sangha" className="w-full object-contain" />
            </div>
          ) : (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border-[1.5px] border-gold/70 bg-ink-soft shadow-xl">
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
                <DiyaIcon className="size-10 text-gold/70" />
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                  Photo coming soon
                </p>
              </div>
            </div>
          )}
          <CornerFrame />
        </div>
      </div>
    </section>
  );
}

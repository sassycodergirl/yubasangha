import GoldButton from "@/components/ui/GoldButton";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import { ArrowRightIcon } from "@/components/ui/icons";
import AboutTimeline from "./AboutTimeline";
import AboutCollage from "./AboutCollage";

// `showTimeline=false` swaps the milestone timeline for a small two-photo
// collage instead -- used on the About Us page, which has its own dedicated
// full timeline section elsewhere on that page and doesn't want the
// carousel repeated here. `showCta=false` (also About Us only) drops the
// "Our Journey" button, which would otherwise just link to the page it's
// already on.
export default function About({ content, showTimeline = true, showCta = true }) {
  const { subtitle, title, description, stats, cta, timeline, values, collageImages, backgroundImage } =
    content;

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <SectionBackground image={backgroundImage} fallback="none" />
      <SectionBlend />

      {/* Soft ambient glow, matches hero's palette */}
      <div className="pointer-events-none absolute -left-40 top-1/3 size-[28rem] rounded-full bg-maroon/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[24rem] rounded-full bg-gold/10 blur-[120px]" />

      <div className="relative mx-auto grid min-w-0 max-w-[1400px] gap-16 px-6 sm:px-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-10 lg:px-16 xl:px-20">
        {/* Left: copy */}
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">{subtitle}</p>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-white sm:text-2xl">
            {title[0]}
            <span className="block text-gold-soft">{title[1]}</span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/65">{description}</p>

          <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:grid-cols-2 lg:gap-x-5 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-2xl text-gold sm:text-3xl">{stat.value}</dd>
                <p className="mt-1 text-[10px] uppercase leading-snug tracking-[0.12em] text-white/55">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>

          {showCta ? (
            <GoldButton href={cta.href} className="mt-10">
              {cta.label}
              <ArrowRightIcon className="size-4" />
            </GoldButton>
          ) : null}
        </div>

        {/* Right: milestone timeline (dynamic from admin in Phase 2), or a
            photo collage in its place -- see `showTimeline` above. */}
        <div className="min-w-0">
          {showTimeline ? (
            <AboutTimeline milestones={timeline} values={values} />
          ) : (
            <AboutCollage images={collageImages} />
          )}
        </div>
      </div>
    </section>
  );
}

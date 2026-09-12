import Image from "next/image";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import CornerFrame from "@/components/ui/CornerFrame";
import { UserIcon } from "@/components/ui/icons";

// Theme 2026 page's artist spotlight: portrait on the left, name/role/quote/
// bio on the right -- one dedicated column for the person behind this year's
// theme, distinct from ThemeStory (the theme's own narrative) above it.
export default function ArtistSpotlight({ content }) {
  const { subtitle, name, role, quote, bio, photo } = content;

  return (
    <section className="relative overflow-hidden bg-ink-soft py-20 text-white sm:py-28">
      <SectionBackground image={null} fallback="none" />
      <SectionBlend />

      <div className="relative mx-auto grid max-w-[1400px] gap-14 px-6 sm:px-10 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:items-center lg:gap-16 lg:px-16 xl:px-20">
        {/* Left: portrait */}
        <div className="relative mx-auto aspect-square w-full max-w-xs">
          <div className="relative h-full w-full overflow-hidden rounded-full border-[1.5px] border-gold/70 bg-ink shadow-xl">
            {photo ? (
              <Image
                src={photo}
                alt={name}
                fill
                unoptimized
                sizes="20rem"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
                <UserIcon className="size-14 text-gold/60" />
              </div>
            )}
          </div>
        </div>

        {/* Right: name, role, quote, bio */}
        <div className="min-w-0 text-center lg:text-left">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">{subtitle}</p>
          <h2 className="mt-4 font-display text-2xl font-bold uppercase leading-tight text-white sm:text-3xl">
            {name}
          </h2>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold-soft">{role}</p>

          <div className="relative mt-6 max-w-xl px-6 lg:px-0">
            <CornerFrame tone="border-gold/40" />
            <p className="font-display text-lg italic leading-relaxed text-gold-soft">
              "{quote}"
            </p>
          </div>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/65">{bio}</p>
        </div>
      </div>
    </section>
  );
}

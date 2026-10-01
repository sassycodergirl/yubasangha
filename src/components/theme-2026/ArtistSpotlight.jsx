import Image from "next/image";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import CornerFrame from "@/components/ui/CornerFrame";
import GhostButton from "@/components/ui/GhostButton";
import { UserIcon, ArrowRightIcon } from "@/components/ui/icons";

// Theme 2026 page's artist spotlight: portrait on the left, name/role/quote/
// bio on the right -- one dedicated column for the person behind this year's
// theme, distinct from ThemeStory (the theme's own narrative) above it. Also
// reused on the homepage (right after Theme) and on the Theme 2026 page --
// both link through to the dedicated /artist page via `showProfileLink`,
// which that page itself sets to false since it IS that destination.
export default function ArtistSpotlight({ content, showProfileLink = true }) {
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

          {/* px-6 lg:px-0 used to drop this box's horizontal padding to
              zero at desktop width (to keep it flush-left with the name/
              role above), which left the corner brackets with nowhere to
              sit but flush against the quote text itself. A small, constant
              padding at every size keeps the brackets clear of the text,
              at the cost of a few pixels' difference in left alignment
              that reads as intentional framing, not a mismatch. */}
          <div className="relative mt-6 max-w-xl px-5 py-3">
            <CornerFrame tone="border-gold/40" />
            <p className="font-display text-lg italic leading-relaxed text-gold-soft">
              &ldquo;{quote}&rdquo;
            </p>
          </div>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/65">{bio}</p>

          {showProfileLink ? (
            <div className="mt-8 flex justify-center lg:justify-start">
              <GhostButton href="/artist">
                View Full Profile
                <ArrowRightIcon className="size-4" />
              </GhostButton>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

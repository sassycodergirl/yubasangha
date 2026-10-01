import GhostButton from "@/components/ui/GhostButton";
import SectionBackground from "@/components/ui/SectionBackground";
import { ArrowRightIcon } from "@/components/ui/icons";
import ThemeGallery from "./ThemeGallery";
import ThemeGalleryGrid from "./ThemeGalleryGrid";

// `showIntro=false` drops the left-column copy (eyebrow/title/tagline/CTA)
// and renders just the gallery, full-width -- used on the Theme 2026 page,
// which already has its own banner/story/artist sections covering that copy
// and only wants this section for its gallery. `galleryLayout="grid"` swaps
// the coverflow slider for a plain grid (still the same `gallery` items) --
// also Theme 2026 page only; the homepage keeps the slider.
export default function Theme({ content, showIntro = true, galleryLayout = "slider" }) {
  const { eyebrow, title, subtitle, taglineLines, cta, backgroundImage, gallery } = content;

  return (
    <section className="relative overflow-hidden bg-[color-mix(in_oklab,#c31d0b_70%,#c55f1296)] py-20 text-white sm:py-28">
      <SectionBackground image={backgroundImage} fallback="none" scrim={false} />

      {/* Color-mix as a tint over the photo (multiply keeps the image's own
          detail showing through) -- when there's no background image yet,
          the section's own bg-[color-mix(...)] above already shows plain. */}
      {backgroundImage ? (
        <div className="pointer-events-none absolute inset-0 bg-[color-mix(in_oklab,#c31d0b_70%,#c81e0a)] opacity-80 mix-blend-multiply" />
      ) : null}

      {/* Soft ambient glow, matches the rest of the site */}
      <div className="pointer-events-none absolute -right-40 top-0 size-[28rem] rounded-full bg-maroon/25 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 size-[24rem] rounded-full bg-gold/10 blur-[120px]" />

      {/* Darker on the left specifically -- that's where the text sits, and
          the raw color-mix background above is too vivid for white text to
          stay readable over. Fades out by mid-section so the gallery on the
          right keeps the full, undimmed color. Skipped when there's no left
          copy to protect. */}
      {showIntro ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
      ) : null}

      <div
        className={`relative mx-auto max-w-[1400px] gap-14 px-6 sm:px-10 lg:items-center lg:gap-16 lg:px-16 xl:px-20 ${
          showIntro
            ? "grid min-w-0 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)]"
            : "flex justify-center"
        }`}
      >
        {showIntro ? (
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">{eyebrow}</p>
            {/* Sized down from the original text-4xl/5xl (a single long,
                unhyphenatable word like "BHALOBASHA" had nowhere to go but
                overflow into the gallery at that size); text-3xl/4xl then
                read as too small. This splits the difference, and swaps the
                very tight leading-[0.95] for a looser leading-snug so the
                now-taller lines of text don't feel cramped on top of each
                other. `break-words` stays on as a safety net for whatever
                an admin titles this next. */}
            <h2 className="mt-4 break-words font-display text-[2rem] font-bold uppercase leading-snug text-white sm:text-[2.5rem]">
              {title}
              <span className="mt-1 block text-[1.5rem] text-gold-soft sm:text-[1.75rem]">{subtitle}</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              {taglineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <GhostButton href={cta.href} className="mt-8">
              {cta.label}
              <ArrowRightIcon className="size-4" />
            </GhostButton>
          </div>
        ) : null}

        {/* Theme gallery (dynamic from admin in Phase 2) -- `mx-auto` centers
            it within its grid column instead of sitting flush against the
            column's left edge (the column is noticeably wider than this
            box's own max-width, so without it the box hugged the text
            column on one side while leaving all the spare width unused on
            the other -- centering splits that space evenly, and widening
            the slider's own cap gives it more of that room to use, not just
            more margin). */}
        <div
          className={`min-w-0 w-full mx-auto ${galleryLayout === "grid" ? "max-w-6xl" : "max-w-4xl"}`}
        >
          {galleryLayout === "grid" ? (
            <ThemeGalleryGrid items={gallery} />
          ) : (
            <ThemeGallery items={gallery} />
          )}
        </div>
      </div>
    </section>
  );
}

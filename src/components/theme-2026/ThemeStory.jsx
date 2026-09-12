import CornerFrame from "@/components/ui/CornerFrame";
import { ImageIcon } from "@/components/ui/icons";

// Theme 2026 page's own story section: two columns, left copy / right image
// -- every inner page's intro section uses this same light `#d3d1d1`
// background (see About Us's AboutIntro), not the site's shared dark
// `bg-ink` look.
export default function ThemeStory({ content }) {
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
            crop box), wide rather than the portrait treatment
            AboutIntro/ArtistSpotlight use, since concept art reads better
            wide and admin-uploaded artwork isn't guaranteed to be 4:3. */}
        <div className="relative mx-auto w-full max-w-2xl">
          {image ? (
            <div className="relative overflow-hidden rounded-lg border-[1.5px] border-gold/70 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element -- natural size, not a fixed `fill` box */}
              <img src={image} alt="Theme 2026 concept artwork" className="w-full object-contain" />
            </div>
          ) : (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border-[1.5px] border-gold/70 bg-ink-soft shadow-xl">
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
                <ImageIcon className="size-10 text-gold/70" />
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                  Artwork coming soon
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

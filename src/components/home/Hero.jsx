import Image from "next/image";
import Link from "next/link";
import HeroCountdown from "./HeroCountdown";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import GoldButton from "@/components/ui/GoldButton";
import GhostButton from "@/components/ui/GhostButton";
import { PlayIcon, BroadcastIcon, MouseIcon } from "@/components/ui/icons";

export default function Hero({ content }) {
  const { motif, titleLines, tagline, location, actions, countdown, bannerImage } = content;

  return (
    <section className="relative isolate min-h-screen w-full overflow-hidden bg-ink text-white">
      {/* Admin-uploaded banner -- `unoptimized` because an uploaded URL can be
          on any host (Supabase Storage, etc.), not just this app's domain. */}
      <Image
        src={bannerImage}
        alt="Hero banner"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-center lg:object-right"
      />

      {/* Overlays for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-[color-mix(in_oklab,#0b070580_80%,transparent)] to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/5 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-6 pb-16 pt-28 sm:px-10 lg:px-16 xl:px-20">
        <div className="max-w-xl banner-section mt-10">
          {/* Motif line */}
          <div className="flex items-center gap-3 font-display text-sm tracking-[0.25em] text-gold">
            <OrnamentDivider className="hidden h-3 w-16 shrink-0 sm:block" />
            {motif.map((word, i) => (
              <span key={i} className="flex items-center gap-3">
                {i > 0 && <span className="text-gold/50">|</span>}
                {word}
              </span>
            ))}
            <OrnamentDivider className="hidden h-3 w-16 shrink-0 sm:block" />
          </div>

          {/* Title */}
          <h1 className="mt-2 font-display font-bold uppercase leading-[0.9] tracking-tight">
            <span className="block text-center text-6xl text-white sm:text-7xl lg:text-8xl">
              {titleLines[0]}
            </span>
            <span className="block text-center text-5xl text-gold-soft sm:text-6xl lg:text-7xl">
              {titleLines[1]}
            </span>
          </h1>

          {/* Tagline */}
          <div className="mt-1.5 flex items-center text-center gap-4 text-[11px] uppercase tracking-[0.25em] text-gold/90 sm:text-xs">
          
            <span>{tagline}</span>
          
          </div>

          {/* Location */}
          <div className="mt-4 flex items-center text-center gap-3 text-xs uppercase tracking-[0.4em] text-gold sm:gap-4">
            <OrnamentDivider className="h-2.5 w-8 shrink-0 sm:h-4 sm:w-20" />
            <span className="font-bold">{location}</span>
            <OrnamentDivider className="h-2.5 w-8 shrink-0 sm:h-4 sm:w-20" />
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <GoldButton href={actions.primary.href}>{actions.primary.label}</GoldButton>
            <GhostButton href={actions.darshan.href}>
              <BroadcastIcon className="size-4" />
              {actions.darshan.label}
            </GhostButton>
            <Link
              href={actions.film.href}
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:text-gold"
            >
              <span className="flex size-10 items-center justify-center rounded-full border border-white/30 transition-colors group-hover:border-gold">
                <PlayIcon className="size-3.5" />
              </span>
              {actions.film.label}
            </Link>
          </div>

          <HeroCountdown countdown={countdown} />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold/80">
          <MouseIcon className="size-4" />
          Scroll to explore
        </span>
      </div>
    </section>
  );
}

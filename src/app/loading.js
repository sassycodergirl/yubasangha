import OrnamentDivider from "@/components/ui/OrnamentDivider";

// Root-level loading fallback. It's shown while a route segment (and its
// layouts, so for public pages that includes Header/Footer) is still
// resolving, so it can't borrow that chrome -- it has to stand on its own.
// Built from the same visual language as the homepage (Hero's `bg-ink` +
// ambient radial gradient, `font-display`/gold palette, OrnamentDivider)
// so the transition into the real page doesn't jump between two looks.
export default function Loading() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,#3a1a12_0%,#1a100b_55%,#0b0705_100%)]" />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
        <span className="relative flex size-16 items-center justify-center">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-gold/25 border-t-gold" />
          {/* eslint-disable-next-line @next/next/no-img-element -- same brand mark Header uses */}
          <img src="/dhak.svg" alt="" className="size-10 object-contain" />
        </span>

        <div className="flex flex-col items-center gap-2">
          <OrnamentDivider className="h-3 w-16" />
          <p className="font-display text-sm uppercase tracking-[0.3em] text-gold-soft">
            Yuba Sangha
          </p>
        </div>
      </div>
    </div>
  );
}

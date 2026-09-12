import OrnamentDivider from "@/components/ui/OrnamentDivider";
import GoldButton from "@/components/ui/GoldButton";
import GhostButton from "@/components/ui/GhostButton";

// Root-level 404. Like loading.js, this renders below the root layout only
// -- the (public) layout's Header/Footer aren't in the tree -- so it carries
// its own version of the site's look (Hero's `bg-ink` + ambient radial
// gradient, `font-display`/gold palette, OrnamentDivider, logo) instead of
// borrowing that chrome.
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink px-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,#3a1a12_0%,#1a100b_55%,#0b0705_100%)]" />

      <div className="relative z-10 flex max-w-lg flex-col items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- same brand mark Header uses */}
      
        <div className="flex flex-col items-center gap-3">
          <span className="font-display text-6xl font-bold text-gold sm:text-7xl">
            404
          </span>
          <OrnamentDivider className="h-3 w-16" />
          <h1 className="font-display text-xl font-semibold uppercase tracking-[0.2em] text-white sm:text-2xl">
            Page Not Found
          </h1>
          <p className="text-sm text-white/70 sm:text-base">
            This page has wandered off the pandal trail. It may have been
            moved, renamed, or never existed.
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <GoldButton href="/">Back to Home</GoldButton>
          <GhostButton href="/contact">Contact Us</GhostButton>
        </div>
      </div>
    </div>
  );
}

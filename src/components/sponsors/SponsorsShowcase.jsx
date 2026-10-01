import Image from "next/image";
import { DiyaIcon } from "@/components/ui/icons";

// Sort priority for these four names, purely so a traditional Diamond-down-
// to-Silver sponsor list still reads top-to-bottom in that order; any other
// tier name (an admin's own category like "Radio Partner") is appended
// after, in the order it first appears among the sponsors. This no longer
// drives any visual difference -- see TierBadge below.
const TIER_ORDER = ["Diamond", "Platinum", "Gold", "Silver"];

const JUSTIFY_CLASS = { left: "justify-start", center: "justify-center", right: "justify-end" };

// Case/space-insensitive so an admin typing "radio partner" in a tier
// override still matches a sponsor tagged "RADIO PARTNER".
const normalizeTier = (tier) => tier.trim().toLowerCase();

function groupByTier(sponsors) {
  const groups = new Map();
  for (const sponsor of sponsors) {
    if (!groups.has(sponsor.tier)) groups.set(sponsor.tier, []);
    groups.get(sponsor.tier).push(sponsor);
  }
  const orderedTiers = [
    ...TIER_ORDER.filter((tier) => groups.has(tier)),
    ...[...groups.keys()].filter((tier) => !TIER_ORDER.includes(tier)),
  ];
  return orderedTiers.map((tier) => ({ tier, sponsors: groups.get(tier) }));
}

// One consistent, festive treatment for every tier label -- a sponsor's
// `tier` is really just whatever category an admin wants to group them
// under now (a sponsorship rank like "Gold", or a role like "Radio
// Partner"), not a fixed rank with its own color anymore (see TIER_ORDER
// above), so every group gets the same premium gold/maroon badge instead of
// some looking dressed up and others falling back to a flat gray pill.
function TierBadge({ tier }) {
  return (
    <span className="relative inline-flex shrink-0 items-center gap-2.5 rounded-full border border-gold/70 bg-gradient-to-b from-maroon to-maroon-dark px-6 py-2 text-xs font-bold uppercase tracking-[0.3em] text-gold-soft shadow-[0_6px_24px_-8px_rgba(201,154,59,0.55)]">
      <DiyaIcon className="size-3.5 text-gold" />
      {tier}
      <DiyaIcon className="size-3.5 text-gold" />
    </span>
  );
}

function SponsorCard({ sponsor }) {
  const width = sponsor.width > 0 ? sponsor.width : 160;
  const height = sponsor.height > 0 ? sponsor.height : 80;
  return (
    <div
      style={{ width, height }}
      className="flex shrink-0 items-center justify-center rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink/10 transition-transform hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative h-full w-full">
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          fill
          unoptimized
          sizes="300px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

// Sponsors page: every sponsor grouped by tier and always fully visible (no
// slider, per request). `layout`/`columns`/`align` are the section-wide
// defaults; `tierLayouts` lets an admin override any one of those three per
// tier (e.g. Gold in a tight 4-column grid, Radio Partner wrapped loosely in
// 6) -- a tier with no override entry just uses the section-wide defaults.
// Each sponsor's own `width`/`height` is separate from all of this (see
// src/lib/eventsSponsors.js). "flex" wraps and centers a tier's cards at
// their own natural sizes; "grid" locks every card in that tier to an even
// N-column grid.
export default function SponsorsShowcase({ content }) {
  const { sponsors, layoutSettings } = content;
  const {
    layout: defaultLayout = "flex",
    columns: defaultColumns = 4,
    align: defaultAlign = "center",
    tierLayouts = [],
  } = layoutSettings ?? {};
  const groups = groupByTier(sponsors);
  const overrides = new Map(tierLayouts.map((entry) => [normalizeTier(entry.tier), entry]));

  return (
    <section className="relative overflow-hidden bg-[#d3d1d1] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl space-y-16 px-6 sm:px-10 lg:px-16">
        {groups.map(({ tier, sponsors: tierSponsors }) => {
          const override = overrides.get(normalizeTier(tier));
          const layout = override?.layout ?? defaultLayout;
          const columns = override?.columns ?? defaultColumns;
          const align = override?.align ?? defaultAlign;
          const justifyClass = JUSTIFY_CLASS[align] ?? JUSTIFY_CLASS.center;

          return (
            <div key={tier}>
              <div className="flex items-center justify-center gap-4">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-maroon/30" />
                <TierBadge tier={tier} />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-maroon/30" />
              </div>

              {layout === "grid" ? (
                <div
                  className={`mt-8 grid items-center gap-5 ${justifyClass}`}
                  style={{ gridTemplateColumns: `repeat(${Math.max(1, columns)}, max-content)` }}
                >
                  {tierSponsors.map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                  ))}
                </div>
              ) : (
                <div className={`mt-8 flex flex-wrap items-center gap-5 ${justifyClass}`}>
                  {tierSponsors.map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

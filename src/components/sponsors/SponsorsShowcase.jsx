import Image from "next/image";

// Display order for known tiers; anything else (a tier name an admin adds
// later) falls back to Silver's styling and is appended after these.
const TIER_ORDER = ["Diamond", "Platinum", "Gold", "Silver"];

// Every tier stays within the site's own maroon/gold/ink palette -- rank is
// conveyed by intensity and card size, not by introducing new colors
// (blue/silver-gray, etc.) that would clash with the rest of the site. Every
// card within a tier shares a fixed size, in a row that wraps and centers --
// a CSS grid with fixed columns was tried first, but left a few sponsors
// stranded in mostly-empty rows (a grid reserves every column whether or
// not there's a card to fill it); a flex row packs cards together instead,
// however many a tier has.
const TIER_STYLE = {
  Diamond: {
    badge: "bg-maroon text-white",
    ring: "ring-2 ring-gold",
    width: "w-56",
    pad: "p-8",
    logo: "h-28",
    shadow: "shadow-[0_10px_40px_-12px_rgba(201,154,59,0.55)]",
  },
  Platinum: {
    badge: "bg-gold text-ink",
    ring: "ring-2 ring-gold/50",
    width: "w-48",
    pad: "p-7",
    logo: "h-24",
    shadow: "shadow-md",
  },
  Gold: {
    badge: "bg-gold/20 text-maroon",
    ring: "ring-1 ring-gold/40",
    width: "w-40",
    pad: "p-6",
    logo: "h-20",
    shadow: "shadow-sm",
  },
  Silver: {
    badge: "bg-ink/10 text-ink/60",
    ring: "ring-1 ring-ink/10",
    width: "w-32",
    pad: "p-5",
    logo: "h-16",
    shadow: "shadow-sm",
  },
};

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

function SponsorCard({ sponsor, style }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-white transition-transform hover:-translate-y-1 ${style.width} ${style.pad} ${style.ring} ${style.shadow}`}
    >
      <div className={`relative w-full ${style.logo}`}>
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          fill
          unoptimized
          sizes="200px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

// Sponsors page: every sponsor grouped by tier and always fully visible (no
// slider, per request) -- card size and badge intensity fall off from
// Diamond down to Silver so the hierarchy reads at a glance, rather than
// every sponsor looking the same regardless of tier.
export default function SponsorsShowcase({ sponsors }) {
  const groups = groupByTier(sponsors);

  return (
    <section className="relative overflow-hidden bg-[#d3d1d1] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl space-y-16 px-6 sm:px-10 lg:px-16">
        {groups.map(({ tier, sponsors: tierSponsors }) => {
          const style = TIER_STYLE[tier] ?? TIER_STYLE.Silver;
          return (
            <div key={tier}>
              <div className="flex items-center justify-center gap-4">
                <span className="h-px flex-1 bg-ink/15" />
                <span
                  className={`shrink-0 rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-[0.3em] ${style.badge}`}
                >
                  {tier}
                </span>
                <span className="h-px flex-1 bg-ink/15" />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
                {tierSponsors.map((sponsor) => (
                  <SponsorCard key={sponsor.id} sponsor={sponsor} style={style} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

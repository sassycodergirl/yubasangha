import Image from "next/image";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import CornerFrame from "@/components/ui/CornerFrame";
import GoldButton from "@/components/ui/GoldButton";
import { ArrowRightIcon, ImageIcon } from "@/components/ui/icons";

// Rich-text body (see RichTextEditor.jsx) rendered as HTML -- these cover
// the handful of tags that editor can actually produce (bold/italic/lists/
// links), styled to match the surrounding white/65 copy instead of
// inheriting the browser's plain black/bullet defaults.
const PROSE_CLASS =
  "text-sm leading-relaxed text-white/65 [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-white [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_p+p]:mt-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1";

// The numbered card row -- no icon any more, just the number watermark,
// title, and description.
function StepCard({ step }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-gold/25 bg-white/[0.03] p-7">
      <CornerFrame tone="border-gold/50" />
      <span className="font-display text-5xl font-bold text-gold/10" aria-hidden="true">
        {step.number}
      </span>
      <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-wide text-white">{step.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{step.description}</p>
    </div>
  );
}

function RowImage({ image, heading, className }) {
  if (!image) {
    return (
      <div className={`flex items-center justify-center rounded-xl border border-gold/25 bg-ink-soft ${className}`}>
        <ImageIcon className="size-8 text-gold/40" />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden rounded-xl border border-gold/25 ${className}`}>
      <Image
        src={image}
        alt={heading || ""}
        fill
        unoptimized
        sizes="(min-width: 1024px) 500px, 90vw"
        className="object-cover"
      />
    </div>
  );
}

// One row of the "content" block below the card row (src/lib/artistPage.js)
// -- `imageColumn` is a 6/12 (half/full) split, admin's own per-row choice:
// 6 sits the image beside the text; 12 (or the image simply being off)
// means the text takes the full width, with a 12-wide image shown full-
// width above it instead of beside it.
function ContentRow({ row }) {
  const { heading, body, image, imageEnabled, imageColumn } = row;
  const showImage = imageEnabled && (image || imageColumn === 6);
  const half = showImage && imageColumn === 6;

  if (!half) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {showImage ? <RowImage image={image} heading={heading} className="aspect-[16/9] w-full" /> : null}
        <div className="text-center">
          {heading ? (
            <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
              {heading}
            </h3>
          ) : null}
          {body ? (
            <div
              className={`${heading ? "mt-3" : ""} ${PROSE_CLASS}`}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl items-center gap-8 sm:grid-cols-2">
      <div className="sm:order-2">
        <RowImage image={image} heading={heading} className="aspect-[4/3] w-full" />
      </div>
      <div className="text-center sm:order-1 sm:text-left">
        {heading ? (
          <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            {heading}
          </h3>
        ) : null}
        {body ? (
          <div className={`${heading ? "mt-3" : ""} ${PROSE_CLASS}`} dangerouslySetInnerHTML={{ __html: body }} />
        ) : null}
      </div>
    </div>
  );
}

// "Meet the Artist" page's own dedicated section: the creative process
// behind the theme -- distinct from ArtistSpotlight (the person) above it
// on the same page. Two independently-toggleable pieces, each hidden
// outright (not just emptied) when switched off in the admin:
//   - the numbered card row (`cardsEnabled`/`steps`)
//   - a free-form heading + rich text + optional image block, or several
//     (`contentEnabled`/`contentRows`), stacked below the cards
// Plain `bg-ink` (darker than ArtistSpotlight's `bg-ink-soft`) so the two
// sections read as separate beats on the page instead of blurring together.
export default function ArtistProcess({ content }) {
  const { cardsEnabled, subtitle, title, description, steps, contentEnabled, contentRows, cta } = content;
  const showCards = cardsEnabled && steps?.length > 0;
  const showContent = contentEnabled && contentRows?.length > 0;

  if (!showCards && !showContent) return null;

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <SectionBackground image={null} fallback="none" />
      <SectionBlend />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">{subtitle}</p>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
            {title[0]}
            <span className="block text-gold-soft">{title[1]}</span>
          </h2>
          <OrnamentDivider className="mx-auto mt-5 h-3 w-24" />
          <p className="mt-6 text-sm leading-relaxed text-white/65">{description}</p>
        </div>

        {showCards ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        ) : null}

        {showContent ? (
          <div className={`${showCards ? "mt-20" : "mt-14"} space-y-16`}>
            {contentRows.map((row, i) => (
              <ContentRow key={i} row={row} />
            ))}
          </div>
        ) : null}

        {cta ? (
          <div className="mt-16 flex justify-center">
            <GoldButton href={cta.href}>
              {cta.label}
              <ArrowRightIcon className="size-4" />
            </GoldButton>
          </div>
        ) : null}
      </div>
    </section>
  );
}

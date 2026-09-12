import Link from "next/link";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionBlend from "@/components/ui/SectionBlend";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import { ChevronRightIcon } from "@/components/ui/icons";

// Shared compact banner for every inner page (About Us, Events, Gallery, ...)
// -- title + breadcrumb over the site's ambient background, same
// SectionBackground/SectionBlend treatment as every homepage section so it
// reads as one continuous design system. Pass `backgroundImage` once an
// admin uploads a real photo for a given page; until then it falls back to
// the shared gradient.
export default function PageBanner({ content }) {
  const { title, breadcrumb, backgroundImage } = content;

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <SectionBackground image={backgroundImage} />
      <SectionBlend />

      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-6 text-center sm:px-10 lg:px-16 xl:px-20">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
          {title}
        </h1>

        <OrnamentDivider className="mt-5 h-3 w-24" />

        <nav aria-label="Breadcrumb" className="mt-5">
          <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/60">
            {breadcrumb.map((crumb, i) => {
              const isLast = i === breadcrumb.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-2">
                  {i > 0 && <ChevronRightIcon className="size-3 text-gold/60" />}
                  {isLast ? (
                    <span className="text-gold">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="transition-colors hover:text-gold">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </section>
  );
}

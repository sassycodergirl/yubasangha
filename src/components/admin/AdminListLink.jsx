import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

// One row in a Pages / Sections / Settings list — consistent card styling
// used across those three list screens.
export default function AdminListLink({ href, title, subtitle, meta }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-xl border border-gold bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/5 hover:shadow-md"
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{title}</p>
        {subtitle ? <p className="mt-0.5 truncate text-sm text-gray-700">{subtitle}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {meta ? <span className="text-xs text-gray-600">{meta}</span> : null}
        <ArrowRightIcon className="size-4 text-gray-600 transition-colors group-hover:text-maroon" />
      </div>
    </Link>
  );
}

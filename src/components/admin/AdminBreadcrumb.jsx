import Link from "next/link";
import { HomeIcon, ChevronRightIcon } from "@/components/ui/icons";

// `items` = [{ label, href }] with the current (non-link) page last. A home
// icon always leads to /admin, ahead of whatever trail is passed in.
export default function AdminBreadcrumb({ items }) {
  const trail = [{ label: "Dashboard", href: "/admin", icon: true }, ...items];

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm">
      {trail.map((item, index) => {
        const isLast = index === trail.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1">
            {index > 0 ? <ChevronRightIcon className="size-3.5 text-gold/60" /> : null}
            {isLast || !item.href ? (
              <span className="rounded-full bg-gold/10 px-2.5 py-1 font-medium text-ink">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-gray-600 transition-colors hover:bg-gold/10 hover:text-maroon"
              >
                {item.icon ? <HomeIcon className="size-3.5" /> : null}
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

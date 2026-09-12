"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GridIcon,
  LayersIcon,
  CalendarIcon,
  ClockIcon,
  ImageIcon,
  BroadcastIcon,
  PinIcon,
  StarIcon,
  GearIcon,
} from "@/components/ui/icons";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: GridIcon, exact: true },
  { label: "Pages", href: "/admin/pages", icon: LayersIcon },
  { label: "Events", href: "/admin/events", icon: CalendarIcon },
  { label: "Puja Schedule", href: "/admin/schedule", icon: ClockIcon },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Live Darshan", href: "/admin/live-darshan", icon: BroadcastIcon },
  { label: "Pandal Map", href: "/admin/map", icon: PinIcon },
  { label: "Sponsors", href: "/admin/sponsors", icon: StarIcon },
  { label: "Settings", href: "/admin/settings", icon: GearIcon },
];

export default function AdminNav({ onNavigate }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1">
      {navItems.map(({ label, href, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-gold/15 text-gold-soft"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className={`size-[18px] ${active ? "text-gold" : ""}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

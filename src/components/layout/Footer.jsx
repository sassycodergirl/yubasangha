"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DonateModal from "./DonateModal";
import { FacebookIcon, InstagramIcon, YoutubeIcon, XIcon } from "@/components/ui/icons";

// Maps the `id` stored per social link (the "footer" content block) to its glyph.
const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  x: XIcon,
};

// The one link styled identically to a plain useful link but, for whatever
// href the "Donation" entry currently points at, opens the same
// DonateModal the header's Donate button uses instead of navigating to a
// page section that doesn't exist. Matched by the "#donate" hash rather
// than the full href since an admin can freely edit this link's href from
// /admin (seen values include both "/contact#donate" and "/#donate").
const isDonateLink = (href) => href.includes("#donate");

export default function Footer({ data, branding, logo, donate }) {
  const { quickLinks, usefulLinks, contact, social } = data;
  const year = new Date().getFullYear();
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <footer className="relative overflow-hidden border-t border-gold/20 bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-14 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src={logo}
                alt={branding.name}
                width={96}
                height={96}
                unoptimized
                className="h-24 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white">
              {branding.name}
            </p>
            <p className="text-xs text-white/60">{branding.secondaryName}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gold">
              {branding.edition}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/50">
              {branding.location}
            </p>

            <div className="mt-5 flex gap-2">
              {social.map((s) => {
                const Icon = SOCIAL_ICONS[s.id];
                return (
                  <a
                    key={s.id}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-9 items-center justify-center rounded-full border border-gold/30 text-white/70 transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Quick Links</p>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Useful Links</p>
            <ul className="mt-4 space-y-2.5">
              {usefulLinks.map((link) =>
                isDonateLink(link.href) ? (
                  <li key={link.href}>
                    <button
                      type="button"
                      onClick={() => setDonateOpen(true)}
                      className="cursor-pointer text-sm text-white/65 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </button>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Contact Us</p>
            <div className="mt-4 space-y-2 text-sm text-white/65">
              <p>
                {contact.addressLines[0]}
                <br />
                {contact.addressLines[1]}
              </p>
              <a
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                className="block transition-colors hover:text-gold"
              >
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="block transition-colors hover:text-gold">
                {contact.email}
              </a>
              <p className="text-xs text-white/45">{contact.socialNote}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gold/15 bg-[#7a1405]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-5 text-center text-[11px] text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:text-left lg:px-16 xl:px-20">
          <p className="text-white">
            &copy; {year} {branding.fullName}. All Rights Reserved.
          </p>
          {/* Developer credit -- deliberately not admin-editable content, unlike
              everything else in the footer. */}
          <p className="text-white">
            Made with ❤ by{" "}
            <a
              href="https://coderbeans.com/"
              target="_blank"
              rel="noreferrer"
              className="text-gold transition-colors hover:text-gold-soft"
            >
              Coderbeans
            </a>
          </p>
        </div>
      </div>

      <DonateModal donate={donate} open={donateOpen} onClose={() => setDonateOpen(false)} />
    </footer>
  );
}

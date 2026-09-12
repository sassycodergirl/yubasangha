"use client";

import { useState } from "react";
import Link from "next/link";
import DonateModal from "./DonateModal";
import GoldButton from "@/components/ui/GoldButton";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";

export default function Header({ data, logo }) {
  const { nav, donate } = data;
  const [open, setOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 text-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-5 sm:px-10 lg:px-16 xl:px-20">
        {/* Brand */}
        <Link href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded logo */}
          <img src={logo} alt="Yuba Sangha" className="h-[104px] w-auto" />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[0.15em] text-white/90 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <GoldButton
            onClick={() => setDonateOpen(true)}
            className="hidden px-6 py-2.5 sm:inline-flex"
          >
            {donate.buttonLabel}
          </GoldButton>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold hover:text-gold xl:hidden"
          >
            {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / overflow menu */}
      {open && (
        <div className="mx-auto max-w-[1400px] px-6 pb-6 xl:hidden">
          <div className="rounded-2xl border border-white/15 bg-ink/95 p-5 backdrop-blur">
            <nav className="flex flex-col divide-y divide-white/10 text-sm uppercase tracking-[0.15em]">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-white/90 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <GoldButton
              onClick={() => {
                setOpen(false);
                setDonateOpen(true);
              }}
              className="mt-4 w-full"
            >
              {donate.buttonLabel}
            </GoldButton>
          </div>
        </div>
      )}

      <DonateModal donate={donate} open={donateOpen} onClose={() => setDonateOpen(false)} />
    </header>
  );
}

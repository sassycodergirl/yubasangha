"use client";

import { useState } from "react";
import AdminNav from "./AdminNav";
import SignOutButton from "./SignOutButton";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";

// Sidebar is off-canvas (hamburger-triggered drawer) below `lg`, static and
// always visible from `lg` up -- a fixed w-64 sidebar has no business eating
// a third of a phone or portrait-tablet screen.
export default function AdminShell({ userEmail, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <div className="flex items-center justify-between border-b border-gold/20 bg-ink px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- same brand mark Header uses */}
          <img src="/logo.svg" alt="Logo YubaSangha" className="size-16 object-contain" />
          <p className="font-display text-xs uppercase tracking-[0.15em] text-gold-soft">
            Yuba Sangha CMS
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-lg border border-white/20 text-white"
        >
          <MenuIcon className="size-5" />
        </button>
      </div>

      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] shrink-0 -translate-x-full flex-col overflow-y-auto bg-ink px-4 py-6 transition-transform duration-200 lg:static lg:w-64 lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <div className="flex items-center justify-between px-2 lg:justify-start lg:gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- same brand mark Header uses */}
            <img src="/logo.svg" alt="Logo YubaSangha" className="w-[65px] object-contain" />
            <div>
              <p className="font-display text-[13px] uppercase tracking-[0.15em] text-gold-soft">
                Yuba Sangha
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">CMS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/5 lg:hidden"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        <OrnamentDivider className="mx-2 mt-4 h-2.5" />

        <div className="mt-6 flex-1">
          <AdminNav onNavigate={() => setOpen(false)} />
        </div>

        <div className="border-t border-white/10 px-1 pt-4">
          <p className="mb-3 truncate text-xs text-white/40">{userEmail}</p>
          <SignOutButton />
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-[antiquewhite] px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}

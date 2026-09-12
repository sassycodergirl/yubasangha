"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";

// Popup shown from the header's Donate buttons. `open` stays mounted for a
// beat after closing so the fade/scale-out transition can play.
export default function DonateModal({ donate, open, onClose }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timeout = setTimeout(() => setMounted(false), 250);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Donate"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close donate dialog"
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative w-full max-w-sm rounded-2xl border border-gold/30 bg-ink p-6 text-center text-white shadow-2xl transition-all duration-300 ease-out ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-gold hover:text-gold"
        >
          <CloseIcon className="size-4" />
        </button>

        <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Support the Puja</p>
        <h2 className="mt-2 font-display text-2xl uppercase text-white">Scan &amp; Donate</h2>
        <p className="mt-1 text-xs text-white/60">
          Every contribution helps power the celebration.
        </p>

        <div className="mx-auto mt-6 w-full max-w-[220px] rounded-xl border border-gold/25 bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded QR */}
          <img
            src={donate.qrImage}
            alt={`QR code to donate to ${donate.orgName}`}
            className="h-full w-full"
          />
        </div>

        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-gold">{donate.orgName}</p>
        <p className="mt-1 text-[11px] text-white/50">UPI ID: {donate.upiId}</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import OrnamentDivider from "@/components/ui/OrnamentDivider";
import GoldButton from "@/components/ui/GoldButton";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-gold/20 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-gold/70";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setSubmitting(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    // No header/footer chrome on this route -- same full-bleed `bg-ink` +
    // ambient radial gradient treatment as not-found.js/loading.js.
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,#3a1a12_0%,#1a100b_55%,#0b0705_100%)]" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- same brand mark Header uses */}
        <img src="/logo-yuba.png" alt="" className="size-[100px] object-contain" />

        <div className="mt-4 flex flex-col items-center gap-2">
          <OrnamentDivider className="h-3 w-16" />
          <p className="font-display text-sm uppercase tracking-[0.3em] text-gold-soft">
            Yuba Sangha
          </p>
          <h1 className="font-display text-lg font-semibold uppercase tracking-[0.2em] text-white">
            Admin Sign In
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full rounded-2xl border border-gold/20 bg-ink-soft/60 p-6 shadow-[0_0_40px_-10px_rgba(201,154,59,0.25)] backdrop-blur-sm"
        >
          <label className="block text-xs uppercase tracking-[0.15em] text-gold-soft/80">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="username"
            />
          </label>

          <label className="mt-4 block text-xs uppercase tracking-[0.15em] text-gold-soft/80">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

          <GoldButton
            type="submit"
            disabled={submitting}
            className="mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </GoldButton>
        </form>
      </div>
    </div>
  );
}

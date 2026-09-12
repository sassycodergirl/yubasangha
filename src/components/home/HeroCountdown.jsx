"use client";

import { useEffect, useState } from "react";
import OrnamentDivider from "@/components/ui/OrnamentDivider";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

function getRemaining(target) {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (n) => String(n).padStart(2, "0");

export default function HeroCountdown({ countdown }) {
  const targetMs = new Date(countdown.target).getTime();
  // Start null so server and first client render match; fill in after mount.
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(getRemaining(targetMs));
    const id = setInterval(() => setTime(getRemaining(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return (
    <div className="mt-6 w-full max-w-xl rounded-xl border border-gold/25 bg-black/35 px-6 py-4 backdrop-blur-sm">
     <div className="mt-1 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-gold">
      <OrnamentDivider className="h-3 w-16 shrink-0" />
      <p className="text-center font-bold text-[10px] uppercase tracking-[0.35em] text-gold">
        
        {countdown.label}
        
      </p>
      <OrnamentDivider className="h-3 w-16 shrink-0" />
     </div> 
      

      <div className="mt-3 flex items-center justify-evenly gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          {UNITS.map((unit, i) => (
            <div key={unit.key} className="flex items-center gap-4 sm:gap-6">
              {i > 0 && <span className="h-10 w-px bg-white/15" />}
              <div className="flex flex-col items-center">
                <span className="font-display text-3xl leading-none text-gold sm:text-4xl">
                  {time ? pad(time[unit.key]) : "00"}
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/55">
                  {unit.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <span className="hidden h-10 w-px bg-white/15 sm:block" />

        <div className="hidden text-center sm:block">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-gold">
            {countdown.occasion}
          </p>
          <p className="text-[11px] uppercase tracking-[0.15em] text-white/70">
            {countdown.date}
          </p>
          <p className="text-[11px] uppercase tracking-[0.15em] text-white/50">
            {countdown.weekday}
          </p>
        </div>
      </div>
    </div>
  );
}

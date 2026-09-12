"use client";

import { signOut } from "next-auth/react";
import { LogoutIcon } from "@/components/ui/icons";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white"
    >
      <LogoutIcon className="size-[16px]" />
      Sign out
    </button>
  );
}

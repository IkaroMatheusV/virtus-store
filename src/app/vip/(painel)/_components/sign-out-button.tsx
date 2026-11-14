"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOutAction } from "../_actions/sign-out";

/** Encerra a sessão VIP. */
export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(() => signOutAction());
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="inline-flex h-9 items-center gap-1.5 px-2 font-heading text-[0.6875rem] uppercase tracking-[0.2em] text-silver/80 transition-colors hover:text-gold disabled:opacity-50"
    >
      <LogOut className="size-3.5" strokeWidth={1.5} /> Sair
    </button>
  );
}

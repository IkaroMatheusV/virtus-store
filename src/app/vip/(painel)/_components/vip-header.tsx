import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "./sign-out-button";
import { VipNav } from "./vip-nav";

/** Cabeçalho do painel: logo, navegação, link para a loja e sair. */
export function VipHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-border bg-virtus-black">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 md:px-8">
        <Logo size="sm" href="/vip" />
        <span className="section-label hidden text-[0.625rem] sm:inline">Painel VIP</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden max-w-48 truncate text-xs text-silver-muted md:inline" title={email}>
            {email}
          </span>
          <Link
            href="/"
            target="_blank"
            className="inline-flex h-9 items-center gap-1.5 px-2 font-heading text-[0.6875rem] uppercase tracking-[0.2em] text-silver/80 transition-colors hover:text-gold"
          >
            Ver loja <ExternalLink className="size-3.5" strokeWidth={1.5} />
          </Link>
          <SignOutButton />
        </div>
        <VipNav />
      </div>
    </header>
  );
}

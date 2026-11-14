"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/vip", label: "Produtos" },
  { href: "/vip/produtos/novo", label: "Novo produto" },
  { href: "/vip/configuracoes", label: "Configurações" },
];

/** Abas do painel com destaque na rota atual. */
export function VipNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Painel" className="w-full">
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/vip"
              ? pathname === "/vip" || (pathname.startsWith("/vip/produtos/") && !pathname.endsWith("/novo"))
              : pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center whitespace-nowrap border-b px-3 font-heading text-[0.6875rem] uppercase tracking-[0.2em] transition-colors",
                  isActive ? "border-gold text-gold" : "border-transparent text-silver/70 hover:text-silver",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

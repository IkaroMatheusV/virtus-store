"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type MobileMenuProps = {
  links: { href: string; label: string }[];
};

/** Menu lateral de categorias para telas pequenas. */
export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        aria-label="Abrir menu"
        className="-ml-2 inline-flex size-10 items-center justify-center rounded-sm text-silver hover:text-gold lg:hidden"
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-border bg-virtus-black">
        <SheetHeader>
          <SheetTitle className="section-label">Categorias</SheetTitle>
        </SheetHeader>
        <nav aria-label="Categorias">
          <ul className="flex flex-col px-4">
            {links.map((link) => (
              <li key={link.href} className="border-b border-border last:border-0">
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-4 font-heading text-sm uppercase tracking-[0.25em] text-silver transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CartButton } from "@/components/cart/cart-button";
import { getCategories } from "@/services/catalog";
import { MobileMenu } from "./mobile-menu";

/** Cabeçalho fixo: logo, categorias e carrinho. */
export async function SiteHeader() {
  const categories = await getCategories();
  const links = [
    { href: "/produtos", label: "Todos" },
    ...categories.map((category) => ({ href: `/produtos?categoria=${category.slug}`, label: category.name })),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-virtus-black/95 backdrop-blur supports-[backdrop-filter]:bg-virtus-black/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:h-20 md:px-8">
        <MobileMenu links={links} />
        <Logo size="sm" className="md:hidden" />
        <Logo size="md" className="hidden md:inline-flex" />

        <nav aria-label="Categorias" className="ml-6 hidden flex-1 lg:block">
          <ul className="flex items-center gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-heading text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-silver/80 transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center">
          <CartButton />
        </div>
      </div>
    </header>
  );
}

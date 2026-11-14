import Link from "next/link";
import { SectionLabel } from "@/components/brand/section-label";
import { ProductGrid } from "@/components/product/product-grid";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

type ProductSectionProps = {
  id: string;
  label: string;
  title: string;
  products: Product[];
  href: string;
  linkLabel: string;
  /** Moldura dourada para chamar atenção (ofertas). */
  isHighlighted?: boolean;
};

/** Seção da home com título, link "ver todos" e grade de produtos. */
export function ProductSection({ id, label, title, products, href, linkLabel, isHighlighted = false }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="mx-auto max-w-7xl px-4 pt-16 md:px-8 md:pt-24">
      <div
        className={cn(
          isHighlighted && "rounded-sm border border-gold/40 p-4 md:p-8",
        )}
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <SectionLabel>{label}</SectionLabel>
            <h2 id={`${id}-titulo`} className="heading-display text-3xl md:text-4xl">
              {title}
            </h2>
          </div>
          <Link
            href={href}
            className="shrink-0 border-b border-gold/60 pb-1 font-heading text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-gold transition-colors hover:border-gold-light hover:text-gold-light"
          >
            {linkLabel}
          </Link>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

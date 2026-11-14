import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/brand/section-label";
import type { Category } from "@/lib/types";

/** Atalhos para as categorias da loja. */
export function CategoryStrip({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="categorias-titulo" className="mx-auto max-w-7xl px-4 pt-16 md:px-8 md:pt-24">
      <SectionLabel id="categorias-titulo" className="mb-6">
        Categorias
      </SectionLabel>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/produtos?categoria=${category.slug}`}
              className="group flex h-20 items-center justify-between rounded-sm border border-border bg-graphite px-4 transition-colors hover:border-gold/60"
            >
              <span className="font-heading text-xs font-medium uppercase tracking-[0.25em] text-silver">
                {category.name}
              </span>
              <ArrowUpRight
                className="size-4 text-silver-muted transition-colors group-hover:text-gold"
                strokeWidth={1.5}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

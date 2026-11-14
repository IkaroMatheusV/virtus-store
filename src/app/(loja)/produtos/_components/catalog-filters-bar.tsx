import Link from "next/link";
import { SORT_OPTIONS, buildCatalogHref, type CatalogFilters } from "@/lib/catalog-filters";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

type CatalogFiltersBarProps = {
  filters: CatalogFilters;
  categories: Category[];
  sizes: string[];
};

/** Filtros do catálogo como links (funciona sem JavaScript e mantém o estado na URL). */
export function CatalogFiltersBar({ filters, categories, sizes }: CatalogFiltersBarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-y border-border py-5">
      <FilterRow label="Categoria">
        <FilterChip href={buildCatalogHref(filters, { category: undefined })} isActive={!filters.category}>
          Todas
        </FilterChip>
        {categories.map((category) => (
          <FilterChip
            key={category.id}
            href={buildCatalogHref(filters, { category: category.slug })}
            isActive={filters.category === category.slug}
          >
            {category.name}
          </FilterChip>
        ))}
        <FilterChip href={buildCatalogHref(filters, { onSale: !filters.onSale })} isActive={filters.onSale}>
          Ofertas
        </FilterChip>
      </FilterRow>

      {sizes.length > 0 && (
        <FilterRow label="Tamanho">
          <FilterChip href={buildCatalogHref(filters, { size: undefined })} isActive={!filters.size}>
            Todos
          </FilterChip>
          {sizes.map((size) => (
            <FilterChip key={size} href={buildCatalogHref(filters, { size })} isActive={filters.size === size}>
              {size}
            </FilterChip>
          ))}
        </FilterRow>
      )}

      <FilterRow label="Ordenar">
        {SORT_OPTIONS.map((option) => (
          <FilterChip
            key={option.value}
            href={buildCatalogHref(filters, { sort: option.value })}
            isActive={filters.sort === option.value}
          >
            {option.label}
          </FilterChip>
        ))}
      </FilterRow>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <span className="w-24 shrink-0 font-heading text-[0.625rem] uppercase tracking-[0.3em] text-silver-muted">
        {label}
      </span>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0 md:pb-0">{children}</div>
    </div>
  );
}

function FilterChip({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "inline-flex h-8 shrink-0 items-center rounded-sm border px-3 font-heading text-[0.6875rem] uppercase tracking-[0.15em] transition-colors",
        isActive
          ? "border-gold bg-gold/10 text-gold"
          : "border-border text-silver/80 hover:border-silver-muted hover:text-silver",
      )}
    >
      {children}
    </Link>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionLabel } from "@/components/brand/section-label";
import { ProductGrid } from "@/components/product/product-grid";
import { collectSizes, filterProducts, parseCatalogFilters } from "@/lib/catalog-filters";
import { getActiveProducts, getCategories } from "@/services/catalog";
import { CatalogFiltersBar } from "./_components/catalog-filters-bar";
import { CatalogSkeleton } from "./_components/catalog-skeleton";
import { EmptyCatalog } from "./_components/empty-catalog";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Camisetas, polos, bermudas, jeans, bonés e calçados masculinos. Envio para todo o Brasil.",
};

/** Catálogo com filtros via URL (?categoria=&tamanho=&ordem=&oferta=1). */
export default function ProductsPage({ searchParams }: PageProps<"/produtos">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ searchParams }: Pick<PageProps<"/produtos">, "searchParams">) {
  const filters = parseCatalogFilters(await searchParams);
  const [products, categories] = await Promise.all([getActiveProducts(), getCategories()]);
  const visibleProducts = filterProducts(products, filters);
  const currentCategory = categories.find((category) => category.slug === filters.category);
  const title = filters.onSale ? "Ofertas" : (currentCategory?.name ?? "Todos os produtos");

  return (
    <>
      <header className="mb-8 flex flex-col gap-2">
        <SectionLabel>Catálogo</SectionLabel>
        <h1 className="heading-display text-3xl md:text-5xl">{title}</h1>
        <p className="text-sm text-silver-muted">
          {visibleProducts.length} {visibleProducts.length === 1 ? "peça" : "peças"}
        </p>
      </header>

      <CatalogFiltersBar filters={filters} categories={categories} sizes={collectSizes(products)} />

      {visibleProducts.length > 0 ? <ProductGrid products={visibleProducts} /> : <EmptyCatalog />}
    </>
  );
}

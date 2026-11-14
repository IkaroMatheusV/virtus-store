"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/types";
import { ProductRowItem } from "./product-row-item";

/** Lista de produtos com busca por nome/categoria. */
export function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.categoryName?.toLowerCase().includes(normalizedQuery),
    );
  }, [products, query]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border px-6 py-16 text-center">
        <p className="heading-display text-lg">Nenhum produto ainda</p>
        <p className="text-sm text-silver-muted">
          Comece pelo{" "}
          <Link href="/vip/produtos/novo" className="text-gold underline-offset-4 hover:underline">
            cadastro do primeiro produto
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-silver-muted" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar produto ou categoria"
          aria-label="Buscar produto"
          className="pl-9"
        />
      </div>

      <div className="hidden grid-cols-[64px_1fr_120px_90px_90px_96px] gap-4 border-b border-border px-3 pb-2 font-heading text-[0.625rem] uppercase tracking-[0.25em] text-silver-muted md:grid">
        <span>Foto</span>
        <span>Produto</span>
        <span>Preço</span>
        <span>Visível</span>
        <span>Destaque</span>
        <span className="text-right">Ações</span>
      </div>

      <ul className="flex flex-col gap-3 md:gap-0 md:divide-y md:divide-border">
        {visibleProducts.map((product) => (
          <ProductRowItem key={product.id} product={product} />
        ))}
      </ul>

      {visibleProducts.length === 0 && (
        <p className="py-10 text-center text-sm text-silver-muted">Nenhum produto encontrado para “{query}”.</p>
      )}
    </div>
  );
}

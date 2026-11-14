import { getEffectivePrice, isOnSale } from "./format-price";
import type { Product } from "./types";

export const SORT_OPTIONS = [
  { value: "recentes", label: "Mais recentes" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export type CatalogFilters = {
  category?: string;
  size?: string;
  sort: SortOption;
  onSale: boolean;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Lê os filtros do catálogo a partir da URL (?categoria=&tamanho=&ordem=&oferta=1). */
export function parseCatalogFilters(searchParams: RawSearchParams): CatalogFilters {
  const sortParam = firstValue(searchParams.ordem);
  const sort = SORT_OPTIONS.find((option) => option.value === sortParam)?.value ?? "recentes";
  return {
    category: firstValue(searchParams.categoria) || undefined,
    size: firstValue(searchParams.tamanho) || undefined,
    sort,
    onSale: firstValue(searchParams.oferta) === "1",
  };
}

/** Monta a URL do catálogo mantendo os filtros atuais e aplicando as mudanças. */
export function buildCatalogHref(current: CatalogFilters, changes: Partial<CatalogFilters>): string {
  const next = { ...current, ...changes };
  const params = new URLSearchParams();
  if (next.category) params.set("categoria", next.category);
  if (next.size) params.set("tamanho", next.size);
  if (next.sort !== "recentes") params.set("ordem", next.sort);
  if (next.onSale) params.set("oferta", "1");
  const query = params.toString();
  return query ? `/produtos?${query}` : "/produtos";
}

/** Aplica filtros e ordenação sobre a lista (mantém a ordem original em "recentes"). */
export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const filtered = products.filter((product) => {
    if (filters.category && product.categorySlug !== filters.category) return false;
    if (filters.size && !product.sizes.includes(filters.size)) return false;
    if (filters.onSale && !isOnSale(product.price, product.promoPrice)) return false;
    return true;
  });

  if (filters.sort === "recentes") return filtered;

  const direction = filters.sort === "menor-preco" ? 1 : -1;
  return [...filtered].sort(
    (first, second) =>
      direction *
      (getEffectivePrice(first.price, first.promoPrice) - getEffectivePrice(second.price, second.promoPrice)),
  );
}

const LETTER_SIZE_ORDER = ["PP", "P", "M", "G", "GG", "XG", "XGG", "Único"];
const UNKNOWN_SIZE_POSITION = 99;

/** Tamanhos disponíveis nos produtos (para os filtros), letras primeiro e números em ordem crescente. */
export function collectSizes(products: Product[]): string[] {
  const sizes = Array.from(new Set(products.flatMap((product) => product.sizes)));
  return sizes.sort((first, second) => {
    const firstIndex = LETTER_SIZE_ORDER.indexOf(first);
    const secondIndex = LETTER_SIZE_ORDER.indexOf(second);
    if (firstIndex !== -1 || secondIndex !== -1) {
      return (
        (firstIndex === -1 ? UNKNOWN_SIZE_POSITION : firstIndex) -
        (secondIndex === -1 ? UNKNOWN_SIZE_POSITION : secondIndex)
      );
    }
    return Number(first) - Number(second) || first.localeCompare(second);
  });
}

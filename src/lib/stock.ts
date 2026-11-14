import { MAX_ITEM_QUANTITY } from "@/lib/cart";

/** Quantidade de peças por tamanho. `null` = estoque não controlado. */
export type SizeStock = Record<string, number> | null;

/** Até quantas peças o aviso "Últimas peças" aparece. */
export const LOW_STOCK_THRESHOLD = 3;

/** Maior quantidade aceita por tamanho no cadastro. */
export const MAX_STOCK_PER_SIZE = 9999;

type StockedProduct = { sizes: string[]; stock: SizeStock };

/** Peças disponíveis do tamanho; `null` quando o estoque não é controlado. */
export function getSizeStock(product: StockedProduct, size: string): number | null {
  if (product.stock === null) return null;
  return Math.max(0, product.stock[size] ?? 0);
}

/** Total de peças do produto; `null` quando o estoque não é controlado. */
export function getTotalStock(product: StockedProduct): number | null {
  if (product.stock === null) return null;
  return product.sizes.reduce((total, size) => total + (getSizeStock(product, size) ?? 0), 0);
}

/** true quando o estoque é controlado e nenhum tamanho tem peças. */
export function isSoldOut(product: StockedProduct): boolean {
  return getTotalStock(product) === 0;
}

/** Tamanhos sem peças (para desabilitar na escolha). */
export function getSoldOutSizes(product: StockedProduct): string[] {
  return product.sizes.filter((size) => getSizeStock(product, size) === 0);
}

/** Quantidade máxima que o cliente pode escolher daquele tamanho. */
export function getMaxQuantity(product: StockedProduct, size: string | null): number {
  if (!size) return MAX_ITEM_QUANTITY;
  const available = getSizeStock(product, size);
  return available === null ? MAX_ITEM_QUANTITY : Math.min(MAX_ITEM_QUANTITY, available);
}

/** Lê o estoque vindo do banco, descartando valores inválidos. */
export function parseStock(raw: unknown): SizeStock {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return null;
  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>)
      .filter(([, value]) => typeof value === "number" && Number.isFinite(value))
      .map(([size, value]) => [size, Math.max(0, Math.floor(value as number))]),
  );
}

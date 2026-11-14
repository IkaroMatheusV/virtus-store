const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um valor numérico em reais, ex.: 65 → "R$ 65,00". */
export function formatPrice(value: number): string {
  // Intl usa espaço não separável (U+00A0); normalizamos para espaço comum.
  return brlFormatter.format(value).replace(/\u00a0/g, " ");
}

/** Preço efetivo de venda: promocional quando existir e for menor que o cheio. */
export function getEffectivePrice(price: number, promoPrice: number | null): number {
  if (promoPrice !== null && promoPrice < price) return promoPrice;
  return price;
}

/** Indica se o produto está em oferta. */
export function isOnSale(price: number, promoPrice: number | null): boolean {
  return promoPrice !== null && promoPrice < price;
}

/** Item guardado no carrinho (persistido no navegador). */
export type CartItem = {
  /** Chave única: produto + tamanho + cor. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  size: string | null;
  color: string | null;
  unitPrice: number;
  quantity: number;
};

export type NewCartItem = Omit<CartItem, "key" | "quantity"> & { quantity?: number };

export const MAX_ITEM_QUANTITY = 20;

export function buildCartItemKey(productId: string, size: string | null, color: string | null): string {
  return [productId, size ?? "-", color ?? "-"].join("|");
}

function clampQuantity(quantity: number): number {
  return Math.min(MAX_ITEM_QUANTITY, Math.max(1, Math.floor(quantity)));
}

/** Adiciona um item; se já existir a mesma variação, soma a quantidade. */
export function addCartItem(items: CartItem[], newItem: NewCartItem): CartItem[] {
  const key = buildCartItemKey(newItem.productId, newItem.size, newItem.color);
  const quantity = clampQuantity(newItem.quantity ?? 1);
  const existing = items.find((item) => item.key === key);

  if (existing) {
    return items.map((item) =>
      item.key === key ? { ...item, quantity: clampQuantity(item.quantity + quantity) } : item,
    );
  }
  return [...items, { ...newItem, key, quantity }];
}

/** Atualiza a quantidade; quantidade < 1 remove o item. */
export function updateCartItemQuantity(items: CartItem[], key: string, quantity: number): CartItem[] {
  if (quantity < 1) return removeCartItem(items, key);
  return items.map((item) => (item.key === key ? { ...item, quantity: clampQuantity(quantity) } : item));
}

export function removeCartItem(items: CartItem[], key: string): CartItem[] {
  return items.filter((item) => item.key !== key);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

/** Lê o carrinho salvo, descartando dados inválidos. */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.key === "string" &&
        typeof item.name === "string" &&
        typeof item.unitPrice === "number" &&
        typeof item.quantity === "number",
    );
  } catch {
    return [];
  }
}

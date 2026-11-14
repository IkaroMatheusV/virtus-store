"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  addCartItem,
  getCartCount,
  getCartTotal,
  parseStoredCart,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
  type NewCartItem,
} from "@/lib/cart";

const STORAGE_KEY = "virtus-cart";
const EMPTY_CART: CartItem[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY_CART;

function readStorage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): CartItem[] {
  const raw = readStorage();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedItems = parseStoredCart(raw);
  }
  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function writeItems(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Armazenamento bloqueado (aba anônima etc.): mantém em memória nesta sessão.
    cachedRaw = JSON.stringify(items);
    cachedItems = items;
  }
  listeners.forEach((listener) => listener());
}

const subscribeNoop = () => () => {};

/** Carrinho de compras persistido no navegador, compartilhado entre componentes e abas. */
export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  /** false no servidor e na hidratação: o carrinho salvo ainda não foi lido. */
  const isHydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const addItem = useCallback((item: NewCartItem) => writeItems(addCartItem(getSnapshot(), item)), []);
  const updateQuantity = useCallback(
    (key: string, quantity: number) => writeItems(updateCartItemQuantity(getSnapshot(), key, quantity)),
    [],
  );
  const removeItem = useCallback((key: string) => writeItems(removeCartItem(getSnapshot(), key)), []);
  const clearCart = useCallback(() => writeItems([]), []);

  return {
    items,
    isHydrated,
    count: getCartCount(items),
    total: getCartTotal(items),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}

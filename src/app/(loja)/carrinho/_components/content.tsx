"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { CartItemRow } from "./cart-item-row";
import { CheckoutForm } from "./checkout-form";
import { CartSummary } from "./cart-summary";

type CartContentProps = {
  whatsappNumber: string;
  shippingNote: string;
};

/** Lista de itens, resumo e formulário de envio do pedido. */
export function CartContent({ whatsappNumber, shippingNote }: CartContentProps) {
  const { items, isHydrated, total, updateQuantity, removeItem, clearCart } = useCart();

  if (!isHydrated) {
    return <Skeleton className="h-64 w-full bg-graphite" aria-busy="true" aria-label="Carregando carrinho" />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-sm border border-dashed border-border px-6 py-20 text-center">
        <p className="heading-display text-xl">Seu carrinho está vazio</p>
        <p className="max-w-sm text-sm text-silver-muted">Escolha suas peças e finalize o pedido pelo WhatsApp.</p>
        <Button asChild>
          <Link href="/produtos">Ver produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <section aria-label="Itens do carrinho">
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {items.map((item) => (
            <CartItemRow
              key={item.key}
              item={item}
              onQuantityChange={(quantity) => updateQuantity(item.key, quantity)}
              onRemove={() => removeItem(item.key)}
            />
          ))}
        </ul>
        <button
          type="button"
          onClick={clearCart}
          className="mt-4 font-heading text-[0.6875rem] uppercase tracking-[0.25em] text-silver-muted transition-colors hover:text-silver"
        >
          Esvaziar carrinho
        </button>
      </section>

      <aside className="flex h-fit flex-col gap-6 rounded-sm border border-border bg-graphite p-5 md:p-6 lg:sticky lg:top-28">
        <CartSummary total={total} shippingNote={shippingNote} />
        <CheckoutForm items={items} whatsappNumber={whatsappNumber} />
      </aside>
    </div>
  );
}

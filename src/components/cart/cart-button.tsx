"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

/** Ícone do carrinho no cabeçalho com a quantidade de itens. */
export function CartButton() {
  const { count } = useCart();
  const label = count > 0 ? `Carrinho com ${count} ${count === 1 ? "item" : "itens"}` : "Carrinho vazio";

  return (
    <Link
      href="/carrinho"
      aria-label={label}
      className="relative inline-flex size-10 items-center justify-center rounded-sm text-silver transition-colors hover:text-gold"
    >
      <ShoppingBag className="size-5" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-sm bg-gold px-1 font-heading text-[0.625rem] font-semibold leading-4 text-virtus-black">
          {count}
        </span>
      )}
    </Link>
  );
}

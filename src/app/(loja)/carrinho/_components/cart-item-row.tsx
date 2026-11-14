"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { ProductImage } from "@/components/product/product-image";
import { formatPrice } from "@/lib/format-price";
import type { CartItem } from "@/lib/cart";

type CartItemRowProps = {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

/** Linha de item no carrinho: foto, variação, quantidade e subtotal. */
export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const variation = [item.size && `Tam. ${item.size}`, item.color].filter(Boolean).join(" · ");

  return (
    <li className="flex gap-4 py-5">
      <Link href={`/produtos/${item.slug}`} className="w-20 shrink-0 md:w-24">
        <ProductImage src={item.image} alt={item.name} sizes="96px" className="rounded-sm" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/produtos/${item.slug}`} className="line-clamp-2 font-medium text-silver hover:text-gold">
              {item.name}
            </Link>
            {variation && <p className="text-sm text-silver-muted">{variation}</p>}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover ${item.name}`}
            className="-mr-2 inline-flex size-8 shrink-0 items-center justify-center text-silver-muted transition-colors hover:text-silver"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <QuantityStepper
            value={item.quantity}
            onChange={onQuantityChange}
            ariaLabel={`Quantidade de ${item.name}`}
            size="sm"
          />
          <p className="font-heading font-semibold text-gold">{formatPrice(item.unitPrice * item.quantity)}</p>
        </div>
      </div>
    </li>
  );
}

import { formatPrice, isOnSale } from "@/lib/format-price";
import { cn } from "@/lib/utils";

type PriceProps = {
  price: number;
  promoPrice: number | null;
  size?: "sm" | "lg";
  className?: string;
};

/** Preço em Montserrat 600 no ouro; em oferta mostra o preço cheio riscado em prata. */
export function Price({ price, promoPrice, size = "sm", className }: PriceProps) {
  const hasDiscount = isOnSale(price, promoPrice);
  const currentPrice = hasDiscount && promoPrice !== null ? promoPrice : price;

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 font-heading", className)}>
      <span className={cn("font-semibold text-gold", size === "lg" ? "text-3xl" : "text-lg")}>
        {formatPrice(currentPrice)}
      </span>
      {hasDiscount && (
        <span className={cn("text-silver-muted line-through", size === "lg" ? "text-base" : "text-sm")}>
          <span className="sr-only">de </span>
          {formatPrice(price)}
        </span>
      )}
    </p>
  );
}

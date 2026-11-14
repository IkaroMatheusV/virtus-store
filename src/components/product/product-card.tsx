import Link from "next/link";
import { Price } from "@/components/brand/price";
import { Tag } from "@/components/brand/tag";
import { ProductImage } from "@/components/product/product-image";
import { isOnSale } from "@/lib/format-price";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  /** Carrega a imagem com prioridade (primeiros cards acima da dobra). */
  isPriority?: boolean;
};

/** Card de produto: foto 4:5, categoria, nome e preço em ouro. */
export function ProductCard({ product, isPriority = false }: ProductCardProps) {
  const hasDiscount = isOnSale(product.price, product.promoPrice);

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-sm border border-border bg-graphite transition-colors hover:border-gold/60 focus-visible:border-gold focus-visible:outline-none"
    >
      <div className="relative">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          priority={isPriority}
          className="transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {hasDiscount && <Tag variant="solid">Oferta</Tag>}
          {product.isNew && <Tag>Novo</Tag>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 md:p-4">
        {product.categoryName && (
          <p className="font-heading text-[0.625rem] uppercase tracking-[0.3em] text-silver-muted">
            {product.categoryName}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm font-medium text-silver md:text-base">{product.name}</h3>
        <Price price={product.price} promoPrice={product.promoPrice} className="mt-auto pt-1" />
      </div>
    </Link>
  );
}

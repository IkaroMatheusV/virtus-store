"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Price } from "@/components/brand/price";
import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getSoldOutSizes, getTotalStock } from "@/lib/stock";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toggleProductAction, type ToggleField } from "../_actions/toggle-product";
import { DeleteProductButton } from "./delete-product-button";

/** Linha do produto no painel: troca rápida de visibilidade/destaque, editar e excluir. */
export function ProductRowItem({ product }: { product: Product }) {
  const [, startTransition] = useTransition();
  const [flags, setOptimisticFlags] = useOptimistic(
    { isActive: product.isActive, isFeatured: product.isFeatured },
    (current, change: { field: ToggleField; value: boolean }) => ({ ...current, [change.field]: change.value }),
  );

  function handleToggle(field: ToggleField, value: boolean) {
    startTransition(async () => {
      setOptimisticFlags({ field, value });
      const result = await toggleProductAction({ id: product.id, field, value });
      if (!result.success) toast.error(result.message ?? "Não foi possível atualizar");
    });
  }

  return (
    <li className="grid grid-cols-[64px_1fr] gap-x-4 gap-y-3 rounded-sm border border-border bg-graphite p-3 md:grid-cols-[64px_1fr_120px_90px_90px_96px] md:items-center md:rounded-none md:border-0 md:bg-transparent">
      <ProductImage src={product.images[0]} alt="" sizes="64px" className="row-span-2 rounded-sm md:row-span-1" />

      <div className="min-w-0">
        <Link href={`/vip/produtos/${product.id}`} className="line-clamp-2 font-medium text-silver hover:text-gold">
          {product.name}
        </Link>
        <p className="text-xs text-silver-muted">
          {product.categoryName ?? "Sem categoria"}
          {product.isNew && " · Novo"}
        </p>
        <StockSummary product={product} />
      </div>

      <div className="col-start-2 flex flex-wrap items-center gap-x-6 gap-y-2 md:contents">
        <Price price={product.price} promoPrice={product.promoPrice} className="text-sm [&>span:first-child]:text-base" />

        <label className="flex items-center gap-2 text-xs text-silver-muted md:block">
          <Switch
            checked={flags.isActive}
            onCheckedChange={(checked) => handleToggle("isActive", checked)}
            aria-label={`Mostrar ${product.name} na loja`}
          />
          <span className="md:sr-only">Visível</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-silver-muted md:block">
          <Switch
            checked={flags.isFeatured}
            onCheckedChange={(checked) => handleToggle("isFeatured", checked)}
            aria-label={`Destacar ${product.name} na página inicial`}
          />
          <span className="md:sr-only">Destaque</span>
        </label>

        <div className="ml-auto flex items-center gap-1 md:justify-end">
          <Button asChild variant="ghost" size="icon" aria-label={`Editar ${product.name}`}>
            <Link href={`/vip/produtos/${product.id}`}>
              <Pencil strokeWidth={1.5} />
            </Link>
          </Button>
          <DeleteProductButton productId={product.id} productName={product.name} />
        </div>
      </div>
    </li>
  );
}

/** Resumo do estoque na linha do painel: total de peças e tamanhos esgotados. */
function StockSummary({ product }: { product: Product }) {
  const total = getTotalStock(product);
  if (total === null) return <p className="text-xs text-silver-muted/70">Estoque não controlado</p>;

  const soldOutSizes = getSoldOutSizes(product);
  const hasSomeSoldOut = total > 0 && soldOutSizes.length > 0;
  return (
    <p className={cn("text-xs", total === 0 ? "font-medium text-destructive" : "text-gold")}>
      {total === 0 ? "Esgotado" : `${total} ${total === 1 ? "peça" : "peças"}`}
      {hasSomeSoldOut && <span className="text-silver-muted"> · sem {soldOutSizes.join(", ")}</span>}
    </p>
  );
}

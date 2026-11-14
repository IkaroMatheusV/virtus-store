import { z } from "zod";
import { MAX_ITEM_QUANTITY } from "@/lib/cart";

type VariantOptions = {
  sizes: string[];
  colors: string[];
};

/** Schema do formulário "Adicionar ao carrinho": tamanho/cor obrigatórios quando o produto tem opções. */
export function createAddToCartSchema({ sizes, colors }: VariantOptions) {
  return z.object({
    size: sizes.length > 0 ? z.enum(sizes as [string, ...string[]], { message: "Escolha um tamanho" }) : z.string(),
    color: colors.length > 0 ? z.enum(colors as [string, ...string[]], { message: "Escolha uma cor" }) : z.string(),
    quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY),
  });
}

export type AddToCartValues = z.infer<ReturnType<typeof createAddToCartSchema>>;

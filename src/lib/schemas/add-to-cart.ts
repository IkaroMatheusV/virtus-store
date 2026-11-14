import { z } from "zod";
import { MAX_ITEM_QUANTITY } from "@/lib/cart";
import { getMaxQuantity, getSoldOutSizes, type SizeStock } from "@/lib/stock";

type VariantOptions = {
  sizes: string[];
  colors: string[];
  /** Peças por tamanho; `null` = sem controle de estoque. */
  stock: SizeStock;
};

/**
 * Schema do formulário "Adicionar ao carrinho": tamanho/cor obrigatórios quando o produto tem opções,
 * tamanho esgotado bloqueado e quantidade limitada às peças disponíveis.
 */
export function createAddToCartSchema({ sizes, colors, stock }: VariantOptions) {
  const product = { sizes, stock };
  const soldOutSizes = getSoldOutSizes(product);

  return z
    .object({
      size: sizes.length > 0 ? z.enum(sizes as [string, ...string[]], { message: "Escolha um tamanho" }) : z.string(),
      color: colors.length > 0 ? z.enum(colors as [string, ...string[]], { message: "Escolha uma cor" }) : z.string(),
      quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY),
    })
    .superRefine((values, context) => {
      if (!values.size) return;
      if (soldOutSizes.includes(values.size)) {
        context.addIssue({ code: "custom", path: ["size"], message: "Esse tamanho está esgotado" });
        return;
      }
      const maxQuantity = getMaxQuantity(product, values.size);
      if (values.quantity > maxQuantity) {
        context.addIssue({
          code: "custom",
          path: ["quantity"],
          message: `Só temos ${maxQuantity} ${maxQuantity === 1 ? "peça" : "peças"} desse tamanho`,
        });
      }
    });
}

export type AddToCartValues = z.infer<ReturnType<typeof createAddToCartSchema>>;

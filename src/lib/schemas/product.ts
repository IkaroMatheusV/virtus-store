import { z } from "zod";
import { MAX_STOCK_PER_SIZE } from "@/lib/stock";

const MAX_IMAGES = 6;

/** Converte string "1.234,56" / "65,00" / "65.5" em número. */
function parseMoney(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;
  return Number(normalized);
}

/** Schema do formulário de produto (painel VIP). Compartilhado entre client e server. */
export const productFormSchema = z
  .object({
    name: z.string().trim().min(2, "Informe o nome do produto").max(120, "Nome muito longo"),
    description: z.string().trim().max(2000, "Descrição muito longa"),
    categoryId: z.string().uuid("Escolha uma categoria"),
    price: z.string().trim().min(1, "Informe o preço"),
    promoPrice: z.string().trim(),
    sizes: z.array(z.string().trim().min(1).max(10)).min(1, "Adicione ao menos um tamanho"),
    colors: z.array(z.string().trim().min(1).max(30)),
    images: z.array(z.string().url()).max(MAX_IMAGES, `Máximo de ${MAX_IMAGES} fotos`),
    /** Liga o controle de peças por tamanho. */
    trackStock: z.boolean(),
    /** Peças por tamanho (só vale com trackStock ligado). */
    stock: z.record(
      z.string(),
      z
        .number({ message: "Informe a quantidade" })
        .int("Use números inteiros")
        .min(0, "A quantidade não pode ser negativa")
        .max(MAX_STOCK_PER_SIZE, "Quantidade muito alta"),
    ),
    isNew: z.boolean(),
    isFeatured: z.boolean(),
    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    const price = parseMoney(values.price);
    if (typeof price !== "number" || Number.isNaN(price) || price <= 0) {
      context.addIssue({ code: "custom", path: ["price"], message: "Preço inválido" });
      return;
    }
    if (values.promoPrice === "") return;
    const promoPrice = parseMoney(values.promoPrice);
    if (typeof promoPrice !== "number" || Number.isNaN(promoPrice) || promoPrice <= 0) {
      context.addIssue({ code: "custom", path: ["promoPrice"], message: "Preço promocional inválido" });
    } else if (promoPrice >= price) {
      context.addIssue({
        code: "custom",
        path: ["promoPrice"],
        message: "O preço promocional deve ser menor que o preço normal",
      });
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

/** Converte os campos de preço do formulário (texto) em número. */
export function toMoney(value: string): number | null {
  const parsed = parseMoney(value);
  return typeof parsed === "number" && !Number.isNaN(parsed) ? Math.round(parsed * 100) / 100 : null;
}

export { MAX_IMAGES };

/** Estoque a gravar no banco: só os tamanhos atuais (faltando = 0), ou null sem controle. */
export function toStockColumn(values: Pick<ProductFormValues, "trackStock" | "stock" | "sizes">): Record<string, number> | null {
  if (!values.trackStock) return null;
  return Object.fromEntries(values.sizes.map((size) => [size, values.stock[size] ?? 0]));
}

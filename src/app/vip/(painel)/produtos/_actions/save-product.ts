"use server";

import { refresh, updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { requireVip } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { productFormSchema, toMoney, toStockColumn, type ProductFormValues } from "@/lib/schemas/product";
import { slugify } from "@/lib/slugify";
import { createSessionClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

type SupabaseSessionClient = NonNullable<Awaited<ReturnType<typeof createSessionClient>>>;

const productIdSchema = z.string().uuid().optional();

const SLUG_SUFFIX_LENGTH = 6;

/** Gera um slug único; se já existir, acrescenta um sufixo curto. */
async function generateUniqueSlug(supabase: SupabaseSessionClient, name: string): Promise<string> {
  const baseSlug = slugify(name) || "produto";
  const { data } = await supabase.from("products").select("id").eq("slug", baseSlug).maybeSingle();
  if (!data) return baseSlug;
  return `${baseSlug}-${crypto.randomUUID().slice(0, SLUG_SUFFIX_LENGTH)}`;
}

/** Cria (sem id) ou atualiza (com id) um produto. Retorna o id salvo. */
export async function saveProductAction(
  input: ProductFormValues,
  productId?: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireVip();

    const idValidation = productIdSchema.safeParse(productId);
    const validation = productFormSchema.safeParse(input);
    if (!idValidation.success || !validation.success) {
      return {
        success: false,
        message: "Confira os campos destacados",
        errors: validation.success ? undefined : z.flattenError(validation.error).fieldErrors,
      };
    }

    const supabase = await createSessionClient();
    if (!supabase) return { success: false, message: "Supabase não configurado" };

    const values = validation.data;
    const row = {
      name: values.name,
      description: values.description,
      category_id: values.categoryId,
      price: toMoney(values.price),
      promo_price: values.promoPrice === "" ? null : toMoney(values.promoPrice),
      sizes: values.sizes,
      colors: values.colors,
      images: values.images,
      stock: toStockColumn(values),
      is_new: values.isNew,
      is_featured: values.isFeatured,
      is_active: values.isActive,
    };

    const query = idValidation.data
      ? supabase.from("products").update(row).eq("id", idValidation.data)
      : supabase.from("products").insert({ ...row, slug: await generateUniqueSlug(supabase, values.name) });

    const { data, error } = await query.select("id").single<{ id: string }>();
    if (error) {
      console.error("[vip] erro ao salvar produto:", error.message);
      return { success: false, message: "Erro ao salvar. Tente novamente." };
    }

    updateTag(CACHE_TAGS.products);
    refresh();
    return {
      success: true,
      message: idValidation.data ? "Produto atualizado!" : "Produto cadastrado!",
      data: { id: data.id },
    };
  } catch (error) {
    // redirect() do requireVip precisa propagar
    unstable_rethrow(error);
    console.error("[vip] erro inesperado ao salvar produto:", error);
    return { success: false, message: "Erro ao processar" };
  }
}

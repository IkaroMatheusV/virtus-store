"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { requireVip } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { getStoragePathFromPublicUrl, PRODUCT_IMAGES_BUCKET } from "@/lib/storage";
import { createSessionClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

const deleteSchema = z.object({ id: z.string().uuid() });

/** Exclui um produto e, na medida do possível, as fotos dele no Storage. */
export async function deleteProductAction(input: z.infer<typeof deleteSchema>): Promise<ActionResult> {
  await requireVip();

  const validation = deleteSchema.safeParse(input);
  if (!validation.success) return { success: false, message: "Produto inválido" };

  const supabase = await createSessionClient();
  if (!supabase) return { success: false, message: "Supabase não configurado" };

  const { data: deleted, error } = await supabase
    .from("products")
    .delete()
    .eq("id", validation.data.id)
    .select("images")
    .maybeSingle<{ images: string[] | null }>();

  if (error) return { success: false, message: "Erro ao excluir. Tente novamente." };

  const imagePaths = (deleted?.images ?? [])
    .map(getStoragePathFromPublicUrl)
    .filter((path): path is string => path !== null);
  if (imagePaths.length > 0) {
    const { error: storageError } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove(imagePaths);
    if (storageError) console.error("[vip] fotos não removidas:", storageError.message);
  }

  updateTag(CACHE_TAGS.products);
  refresh();
  return { success: true };
}

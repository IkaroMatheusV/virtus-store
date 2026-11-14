"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { requireVip } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createSessionClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

const toggleSchema = z.object({
  id: z.string().uuid(),
  field: z.enum(["isActive", "isFeatured"]),
  value: z.boolean(),
});

export type ToggleField = z.infer<typeof toggleSchema>["field"];
export type ToggleProductInput = z.infer<typeof toggleSchema>;

const COLUMN_BY_FIELD: Record<ToggleField, string> = {
  isActive: "is_active",
  isFeatured: "is_featured",
};

/** Liga/desliga "visível na loja" ou "destaque" de um produto. */
export async function toggleProductAction(input: ToggleProductInput): Promise<ActionResult> {
  await requireVip();

  const validation = toggleSchema.safeParse(input);
  if (!validation.success) return { success: false, message: "Dados inválidos" };

  const supabase = await createSessionClient();
  if (!supabase) return { success: false, message: "Supabase não configurado" };

  const { id, field, value } = validation.data;
  const { error } = await supabase
    .from("products")
    .update({ [COLUMN_BY_FIELD[field]]: value })
    .eq("id", id);

  if (error) return { success: false, message: "Erro ao salvar. Tente novamente." };

  updateTag(CACHE_TAGS.products);
  refresh();
  return { success: true };
}

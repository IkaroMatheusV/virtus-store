"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { requireVip } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { settingsFormSchema, type SettingsFormValues } from "@/lib/schemas/settings";
import { createSessionClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

/** Salva WhatsApp, Instagram e textos da loja (linha única id = 1). */
export async function saveSettingsAction(input: SettingsFormValues): Promise<ActionResult> {
  await requireVip();

  const validation = settingsFormSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: "Confira os campos destacados",
      errors: z.flattenError(validation.error).fieldErrors,
    };
  }

  const supabase = await createSessionClient();
  if (!supabase) return { success: false, message: "Supabase não configurado" };

  const values = validation.data;
  const { error } = await supabase
    .from("store_settings")
    .update({
      whatsapp_number: values.whatsappNumber.replace(/\D/g, ""),
      instagram_handle: values.instagramHandle.replace(/^@/, ""),
      city: values.city,
      shipping_note: values.shippingNote,
      hero_title: values.heroTitle,
      hero_subtitle: values.heroSubtitle,
      promo_text: values.promoText,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error("[vip] erro ao salvar configurações:", error.message);
    return { success: false, message: "Erro ao salvar. Tente novamente." };
  }

  updateTag(CACHE_TAGS.settings);
  refresh();
  return { success: true, message: "Configurações salvas!" };
}

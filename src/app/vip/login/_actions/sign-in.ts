"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSessionClient } from "@/lib/supabase/server";
import { loginFormSchema, type LoginFormValues } from "@/lib/schemas/login";
import type { ActionResult } from "@/lib/types";

/** Autentica o dono da loja. Só usuários presentes em vip_users entram no painel. */
export async function signInAction(input: LoginFormValues): Promise<ActionResult> {
  const validation = loginFormSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, message: "Confira e-mail e senha", errors: z.flattenError(validation.error).fieldErrors };
  }

  const supabase = await createSessionClient();
  if (!supabase) return { success: false, message: "Supabase não configurado" };

  const { data, error } = await supabase.auth.signInWithPassword(validation.data);
  if (error || !data.user) {
    return { success: false, message: "E-mail ou senha incorretos" };
  }

  const { data: vipRow } = await supabase
    .from("vip_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!vipRow) {
    await supabase.auth.signOut();
    return { success: false, message: "Este usuário não tem acesso VIP" };
  }

  redirect("/vip");
}

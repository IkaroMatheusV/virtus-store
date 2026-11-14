"use server";

import { redirect } from "next/navigation";
import { VIP_LOGIN_PATH } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

/** Encerra a sessão e volta para o login VIP. */
export async function signOutAction(): Promise<void> {
  const supabase = await createSessionClient();
  await supabase?.auth.signOut();
  redirect(VIP_LOGIN_PATH);
}

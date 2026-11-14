import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

export type VipUser = {
  id: string;
  email: string;
};

export const VIP_LOGIN_PATH = "/vip/login";

/**
 * Retorna o usuário VIP logado ou null. Valida a sessão no Supabase (getUser)
 * e confirma que o usuário está na tabela vip_users. Deduplicado por requisição.
 */
export const getVipUser = cache(async (): Promise<VipUser | null> => {
  const supabase = await createSessionClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: vipRow } = await supabase
    .from("vip_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!vipRow) return null;

  return { id: user.id, email: user.email ?? "" };
});

/** Exige acesso VIP; sem acesso redireciona para o login. Use em páginas, DAL e Server Actions. */
export async function requireVip(): Promise<VipUser> {
  const vipUser = await getVipUser();
  if (!vipUser) redirect(VIP_LOGIN_PATH);
  return vipUser;
}

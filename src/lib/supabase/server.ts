import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

/** Cliente com a sessão do usuário (cookies). Usar em Server Components, Actions e DAL autenticados. */
export async function createSessionClient() {
  // Lê os cookies antes de tudo: garante renderização por requisição mesmo sem Supabase configurado.
  const cookieStore = await cookies();
  // A sessão só existe numa requisição real: o Supabase lê Date.now() ao validar o token,
  // o que quebraria o pré-render do Partial Prefetching (os cookies resolvem ali).
  await connection();
  const env = getSupabaseEnv();
  if (!env) return null;

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado de um Server Component: o proxy já renova a sessão, então podemos ignorar.
        }
      },
    },
  });
}

import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

/**
 * Cliente anônimo, sem cookies — usado nas leituras públicas cacheadas ("use cache").
 * Respeita o RLS: só enxerga produtos ativos, categorias e configurações.
 */
export function createPublicClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

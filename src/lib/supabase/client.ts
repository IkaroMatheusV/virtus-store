import { createBrowserClient } from "@supabase/ssr";

/** Cliente do navegador (usa a sessão salva em cookies). Usado no upload de fotos do painel VIP. */
export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase não configurado");
  return createBrowserClient(url, anonKey);
}

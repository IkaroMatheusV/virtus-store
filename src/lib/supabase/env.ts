/** Credenciais públicas do Supabase. Retorna null quando o projeto ainda não foi configurado. */
export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/** true quando as variáveis do Supabase estão presentes. */
export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Aviso exibido apenas enquanto o Supabase não estiver configurado (dados de exemplo). */
export function DemoNotice() {
  if (isSupabaseConfigured()) return null;
  return (
    <p className="border-b border-border bg-graphite px-4 py-1.5 text-center text-xs text-silver-muted">
      Modo demonstração: produtos de exemplo. Configure o Supabase no arquivo <code>.env.local</code> para usar o
      catálogo real.
    </p>
  );
}

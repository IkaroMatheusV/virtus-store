import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Área VIP",
  robots: { index: false, follow: false },
};

/** Login do dono da loja. */
export default function VipLoginPage() {
  const isConfigured = isSupabaseConfigured();

  return (
    <main className="grid-surface flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-sm flex-col gap-8 rounded-sm border border-border bg-graphite p-6 md:p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo size="lg" />
          <div className="flex flex-col gap-1">
            <p className="section-label">Área VIP</p>
            <h1 className="font-heading text-lg font-light uppercase tracking-[0.2em] text-silver">Painel do lojista</h1>
          </div>
        </div>

        {isConfigured ? (
          <LoginForm />
        ) : (
          <p className="rounded-sm border border-gold/40 p-4 text-sm text-silver/80">
            O Supabase ainda não foi configurado. Preencha <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no arquivo <code>.env.local</code> e siga o README para criar
            o acesso VIP.
          </p>
        )}

        <Link
          href="/"
          className="text-center font-heading text-[0.6875rem] uppercase tracking-[0.25em] text-silver-muted transition-colors hover:text-gold"
        >
          Voltar para a loja
        </Link>
      </div>
    </main>
  );
}

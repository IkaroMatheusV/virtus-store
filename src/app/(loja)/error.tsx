"use client";

import { Button } from "@/components/ui/button";

/** Fallback de erro da loja. */
export default function StoreError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-24 text-center">
      <p className="section-label">Algo deu errado</p>
      <h1 className="heading-display text-2xl md:text-4xl">Não foi possível carregar</h1>
      <p className="text-silver-muted">Tente novamente em instantes. Se o problema continuar, fale com a loja.</p>
      <Button onClick={reset}>Tentar de novo</Button>
    </div>
  );
}

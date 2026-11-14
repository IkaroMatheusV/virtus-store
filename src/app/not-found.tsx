import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

/** Página 404 com a identidade da marca. */
export default function NotFound() {
  return (
    <main className="grid-surface flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <Logo size="lg" />
      <p className="section-label">Erro 404</p>
      <h1 className="heading-display text-3xl md:text-5xl">Página não encontrada</h1>
      <p className="max-w-sm text-silver-muted">A peça ou página que você procura não está mais disponível.</p>
      <Button asChild>
        <Link href="/produtos">Ver produtos</Link>
      </Button>
    </main>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Estado vazio quando nenhum produto atende aos filtros. */
export function EmptyCatalog() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-sm border border-dashed border-border px-6 py-20 text-center">
      <p className="heading-display text-xl">Nenhuma peça encontrada</p>
      <p className="max-w-sm text-sm text-silver-muted">
        Tente outro tamanho ou categoria. Novidades chegam toda semana.
      </p>
      <Button asChild variant="outline">
        <Link href="/produtos">Limpar filtros</Link>
      </Button>
    </div>
  );
}

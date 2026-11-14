import { Skeleton } from "@/components/ui/skeleton";

/**
 * Fallback das páginas do painel. As páginas leem a sessão por requisição,
 * então cada navegação entre abas mostra este esqueleto enquanto os dados chegam.
 */
export default function VipPanelLoading() {
  return (
    <div aria-busy="true" aria-label="Carregando">
      <Skeleton className="mb-4 h-10 w-64 bg-graphite" />
      <Skeleton className="h-96 w-full bg-graphite" />
    </div>
  );
}

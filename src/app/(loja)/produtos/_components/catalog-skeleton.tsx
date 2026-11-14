import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_CARD_COUNT = 8;

/** Esqueleto exibido enquanto o catálogo carrega. */
export function CatalogSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando produtos">
      <Skeleton className="mb-3 h-4 w-24 bg-graphite" />
      <Skeleton className="mb-10 h-12 w-72 bg-graphite" />
      <Skeleton className="mb-8 h-28 w-full bg-graphite" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/6] w-full bg-graphite" />
        ))}
      </div>
    </div>
  );
}

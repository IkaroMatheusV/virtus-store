import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { requireVip } from "@/lib/auth";
import { VipHeader } from "./_components/vip-header";

export const metadata: Metadata = {
  title: "Painel VIP",
  robots: { index: false, follow: false },
};

/** Área restrita: lê a sessão por requisição, então não entra no shell estático. */
export const instant = false;

/** Layout do painel VIP: valida o acesso antes de renderizar qualquer página. */
export default function VipPanelLayout({ children }: LayoutProps<"/vip">) {
  return (
    <Suspense fallback={<PanelSkeleton />}>
      <VipShell>{children}</VipShell>
    </Suspense>
  );
}

async function VipShell({ children }: { children: React.ReactNode }) {
  const vipUser = await requireVip();
  return (
    <>
      <VipHeader email={vipUser.email} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8 md:py-12">{children}</main>
    </>
  );
}

function PanelSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8" aria-busy="true" aria-label="Carregando painel">
      <Skeleton className="mb-10 h-14 w-full bg-graphite" />
      <Skeleton className="mb-4 h-10 w-64 bg-graphite" />
      <Skeleton className="h-96 w-full bg-graphite" />
    </div>
  );
}

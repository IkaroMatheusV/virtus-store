import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/brand/section-label";
import { getVipProducts } from "./_data-access/get-vip-products";
import { ProductsTable } from "./_components/products-table";

/** Lista de produtos do painel VIP. */
export default async function VipProductsPage() {
  const products = await getVipProducts();
  const activeCount = products.filter((product) => product.isActive).length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <SectionLabel>Catálogo</SectionLabel>
          <h1 className="heading-display text-3xl">Produtos</h1>
          <p className="text-sm text-silver-muted">
            {products.length} cadastrados · {activeCount} visíveis na loja
          </p>
        </div>
        <Button asChild>
          <Link href="/vip/produtos/novo">
            <Plus data-icon="inline-start" strokeWidth={1.5} /> Novo produto
          </Link>
        </Button>
      </div>
      <ProductsTable products={products} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronLeft, Truck } from "lucide-react";
import { Price } from "@/components/brand/price";
import { SectionLabel } from "@/components/brand/section-label";
import { GoldDivider } from "@/components/brand/gold-divider";
import { Tag } from "@/components/brand/tag";
import { ProductGrid } from "@/components/product/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { isOnSale } from "@/lib/format-price";
import { getProductBySlug, getRelatedProducts, getStoreSettings } from "@/services/catalog";
import { ProductGallery } from "./_components/product-gallery";
import { AddToCartForm } from "./_components/add-to-cart-form";

const RELATED_LIMIT = 4;

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: product.name,
    description: product.description || `${product.name} na Virtus Store.`,
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

/** Página de detalhe do produto. */
export default function ProductPage({ params }: PageProps<"/produtos/[slug]">) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <Link
        href="/produtos"
        className="mb-6 inline-flex items-center gap-1 font-heading text-[0.6875rem] uppercase tracking-[0.25em] text-silver-muted transition-colors hover:text-gold"
      >
        <ChevronLeft className="size-4" strokeWidth={1.5} /> Produtos
      </Link>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </div>
  );
}

async function ProductDetails({ params }: Pick<PageProps<"/produtos/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [settings, relatedProducts] = await Promise.all([
    getStoreSettings(),
    getRelatedProducts(product, RELATED_LIMIT),
  ]);

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {product.categoryName && <SectionLabel>{product.categoryName}</SectionLabel>}
            {isOnSale(product.price, product.promoPrice) && <Tag variant="solid">Oferta</Tag>}
            {product.isNew && <Tag>Novo</Tag>}
          </div>
          <h1 className="font-heading text-2xl font-medium uppercase tracking-[0.12em] text-silver md:text-4xl">
            {product.name}
          </h1>
          <Price price={product.price} promoPrice={product.promoPrice} size="lg" />
          {product.description && <p className="text-base text-silver/80">{product.description}</p>}

          <GoldDivider className="my-1" />

          <AddToCartForm product={product} whatsappNumber={settings.whatsappNumber} />

          <p className="flex items-center gap-2 text-sm text-silver-muted">
            <Truck className="size-4 text-gold" strokeWidth={1.5} />
            {settings.shippingNote}
          </p>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section aria-labelledby="relacionados-titulo" className="pt-20">
          <SectionLabel className="mb-2">Combine com</SectionLabel>
          <h2 id="relacionados-titulo" className="heading-display mb-8 text-2xl md:text-3xl">
            Você também pode gostar
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12" aria-busy="true" aria-label="Carregando produto">
      <Skeleton className="aspect-[4/5] w-full bg-graphite" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-24 bg-graphite" />
        <Skeleton className="h-10 w-3/4 bg-graphite" />
        <Skeleton className="h-8 w-32 bg-graphite" />
        <Skeleton className="h-24 w-full bg-graphite" />
        <Skeleton className="h-12 w-full bg-graphite" />
      </div>
    </div>
  );
}

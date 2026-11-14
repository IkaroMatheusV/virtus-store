import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SectionLabel } from "@/components/brand/section-label";
import { getCategories } from "@/services/catalog";
import { getProductById } from "../_data-access/get-product-by-id";
import { ProductForm } from "../_components/product-form";

/** Edição de um produto existente. */
export default async function EditProductPage({ params }: PageProps<"/vip/produtos/[id]">) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <SectionLabel>Editar produto</SectionLabel>
          <h1 className="heading-display text-2xl md:text-3xl">{product.name}</h1>
        </div>
        {product.isActive && (
          <Link
            href={`/produtos/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 font-heading text-[0.6875rem] uppercase tracking-[0.2em] text-gold hover:text-gold-light"
          >
            Ver na loja <ExternalLink className="size-3.5" strokeWidth={1.5} />
          </Link>
        )}
      </div>
      <ProductForm categories={categories} product={product} />
    </>
  );
}

import { SectionLabel } from "@/components/brand/section-label";
import { getCategories } from "@/services/catalog";
import { ProductForm } from "../_components/product-form";

/** Cadastro de novo produto. */
export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <SectionLabel>Catálogo</SectionLabel>
        <h1 className="heading-display text-3xl">Novo produto</h1>
      </div>
      <ProductForm categories={categories} />
    </>
  );
}

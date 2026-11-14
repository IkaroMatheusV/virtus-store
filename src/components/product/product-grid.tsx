import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";

const PRIORITY_IMAGE_COUNT = 4;

/** Grade responsiva de produtos (2 colunas no celular, até 4 no desktop). */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} isPriority={index < PRIORITY_IMAGE_COUNT} />
        </li>
      ))}
    </ul>
  );
}

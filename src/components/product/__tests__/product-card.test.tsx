import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/product/product-card";
import { DEMO_PRODUCTS } from "@/lib/demo-data";

describe("ProductCard", () => {
  it("mostra nome, categoria, preço e link do produto", () => {
    const product = DEMO_PRODUCTS[0];
    render(<ProductCard product={product} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", `/produtos/${product.slug}`);
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText("Camisetas")).toBeInTheDocument();
    expect(screen.getByText("R$ 65,00")).toBeInTheDocument();
    expect(screen.getByText("Novo")).toBeInTheDocument();
  });

  it("mostra selo de oferta e preço cheio riscado", () => {
    const product = DEMO_PRODUCTS.find((item) => item.promoPrice !== null)!;
    render(<ProductCard product={product} />);

    expect(screen.getByText("Oferta")).toBeInTheDocument();
    expect(screen.getByText("R$ 69,90")).toBeInTheDocument();
    expect(screen.getByText("R$ 79,90")).toHaveClass("line-through");
  });
});

import { buildCatalogHref, collectSizes, filterProducts, parseCatalogFilters } from "@/lib/catalog-filters";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import { formatPrice } from "@/lib/format-price";
import { slugify } from "@/lib/slugify";

describe("parseCatalogFilters", () => {
  it("lê os parâmetros da URL e usa 'recentes' como padrão", () => {
    expect(parseCatalogFilters({ categoria: "polos", tamanho: ["M", "G"], ordem: "invalida" })).toEqual({
      category: "polos",
      size: "M",
      sort: "recentes",
      onSale: false,
    });
  });
});

describe("buildCatalogHref", () => {
  it("mantém filtros atuais e aplica mudanças", () => {
    const current = parseCatalogFilters({ categoria: "polos" });
    expect(buildCatalogHref(current, { sort: "menor-preco" })).toBe("/produtos?categoria=polos&ordem=menor-preco");
    expect(buildCatalogHref(current, { category: undefined })).toBe("/produtos");
  });
});

describe("filterProducts", () => {
  it("filtra por categoria e tamanho", () => {
    const result = filterProducts(DEMO_PRODUCTS, { category: "camisetas", size: "GG", sort: "recentes", onSale: false });
    expect(result.map((product) => product.slug)).toEqual(["camiseta-basica-premium", "camiseta-oversized-concreto"]);
  });

  it("filtra ofertas e ordena pelo preço efetivo", () => {
    const result = filterProducts(DEMO_PRODUCTS, { sort: "menor-preco", onSale: true });
    expect(result.map((product) => product.promoPrice)).toEqual([69.9, 84.9, 219.9]);
  });
});

describe("collectSizes", () => {
  it("ordena letras antes dos números", () => {
    expect(collectSizes(DEMO_PRODUCTS)).toEqual([
      "P", "M", "G", "GG", "Único", "38", "39", "40", "41", "42", "43", "44", "46",
    ]);
  });
});

describe("utilitários", () => {
  it("formata preços em reais", () => {
    expect(formatPrice(65)).toBe("R$ 65,00");
    expect(formatPrice(1299.9)).toBe("R$ 1.299,90");
  });

  it("gera slugs sem acentos", () => {
    expect(slugify("  Boné Aba Curva — Preto ")).toBe("bone-aba-curva-preto");
  });
});

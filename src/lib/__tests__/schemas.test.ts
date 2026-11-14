import { productFormSchema, toMoney, type ProductFormValues } from "@/lib/schemas/product";
import { settingsFormSchema } from "@/lib/schemas/settings";

const validProduct: ProductFormValues = {
  name: "Camiseta básica",
  description: "",
  categoryId: "3f1c2b9e-8a7d-4c6b-9e2f-1a2b3c4d5e6f",
  price: "65,00",
  promoPrice: "",
  sizes: ["M"],
  colors: [],
  images: [],
  isNew: true,
  isFeatured: false,
  isActive: true,
};

describe("productFormSchema", () => {
  it("aceita um produto válido", () => {
    expect(productFormSchema.safeParse(validProduct).success).toBe(true);
  });

  it("exige preço promocional menor que o preço", () => {
    const result = productFormSchema.safeParse({ ...validProduct, promoPrice: "70,00" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["promoPrice"]);
  });

  it("exige ao menos um tamanho", () => {
    expect(productFormSchema.safeParse({ ...validProduct, sizes: [] }).success).toBe(false);
  });

  it("rejeita preço inválido", () => {
    expect(productFormSchema.safeParse({ ...validProduct, price: "abc" }).success).toBe(false);
  });
});

describe("toMoney", () => {
  it("entende vírgula e ponto de milhar", () => {
    expect(toMoney("1.299,90")).toBe(1299.9);
    expect(toMoney("65.5")).toBe(65.5);
    expect(toMoney("")).toBeNull();
  });
});

describe("settingsFormSchema", () => {
  const validSettings = {
    whatsappNumber: "(88) 99999-1234",
    instagramHandle: "@virtus.store",
    city: "Porteiras-CE",
    shippingNote: "Enviamos para todo o Brasil.",
    heroTitle: "Vista sua melhor versão",
    heroSubtitle: "",
    promoText: "",
  };

  it("aceita configurações válidas", () => {
    expect(settingsFormSchema.safeParse(validSettings).success).toBe(true);
  });

  it("rejeita WhatsApp sem DDD", () => {
    expect(settingsFormSchema.safeParse({ ...validSettings, whatsappNumber: "99999-1234" }).success).toBe(false);
  });
});

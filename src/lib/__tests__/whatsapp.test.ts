import { buildOrderMessage, buildWhatsAppUrl, getOrderTotal, normalizeWhatsAppNumber } from "@/lib/whatsapp";

const items = [
  { name: "Camiseta básica premium", size: "M", color: "Preto", quantity: 2, unitPrice: 65 },
  { name: "Boné aba curva", size: null, color: null, quantity: 1, unitPrice: 59.9 },
];

describe("normalizeWhatsAppNumber", () => {
  it("adiciona o DDI 55 em números brasileiros com DDD", () => {
    expect(normalizeWhatsAppNumber("(88) 99999-1234")).toBe("5588999991234");
  });

  it("mantém números que já têm DDI", () => {
    expect(normalizeWhatsAppNumber("+55 88 99999-1234")).toBe("5588999991234");
  });
});

describe("buildOrderMessage", () => {
  it("lista itens, variações, total e dados do cliente", () => {
    const message = buildOrderMessage(items, { name: "João", city: "Porteiras-CE", note: "Pix" });

    expect(message).toContain("• 2x Camiseta básica premium (Tam. M · Preto) — R$ 130,00");
    expect(message).toContain("• 1x Boné aba curva — R$ 59,90");
    expect(message).toContain("*Total: R$ 189,90*");
    expect(message).toContain("Nome: João");
    expect(message).toContain("Cidade: Porteiras-CE");
    expect(message).toContain("Observação: Pix");
  });

  it("omite dados do cliente quando não informados", () => {
    const message = buildOrderMessage([items[0]]);
    expect(message).not.toContain("Nome:");
  });
});

describe("buildWhatsAppUrl", () => {
  it("monta o link wa.me com a mensagem codificada", () => {
    expect(buildWhatsAppUrl("88 99999-1234", "Olá, Virtus!")).toBe(
      "https://wa.me/5588999991234?text=Ol%C3%A1%2C%20Virtus!",
    );
  });

  it("monta o link sem texto", () => {
    expect(buildWhatsAppUrl("5588999991234")).toBe("https://wa.me/5588999991234");
  });
});

describe("getOrderTotal", () => {
  it("soma preço × quantidade", () => {
    expect(getOrderTotal(items)).toBeCloseTo(189.9);
  });
});

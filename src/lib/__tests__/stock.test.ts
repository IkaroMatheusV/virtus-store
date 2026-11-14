import { addCartItem, updateCartItemQuantity, MAX_ITEM_QUANTITY, type NewCartItem } from "@/lib/cart";
import { createAddToCartSchema } from "@/lib/schemas/add-to-cart";
import { toStockColumn } from "@/lib/schemas/product";
import {
  getMaxQuantity,
  getSizeStock,
  getSoldOutSizes,
  getTotalStock,
  isSoldOut,
  parseStock,
} from "@/lib/stock";

const tracked = { sizes: ["P", "M", "G"], stock: { P: 3, M: 0 } };
const untracked = { sizes: ["P", "M"], stock: null };

describe("estoque por tamanho", () => {
  it("lê a quantidade de cada tamanho (faltando = 0)", () => {
    expect(getSizeStock(tracked, "P")).toBe(3);
    expect(getSizeStock(tracked, "G")).toBe(0);
    expect(getTotalStock(tracked)).toBe(3);
    expect(getSoldOutSizes(tracked)).toEqual(["M", "G"]);
  });

  it("produto sem controle de estoque nunca esgota", () => {
    expect(getSizeStock(untracked, "P")).toBeNull();
    expect(isSoldOut(untracked)).toBe(false);
    expect(getMaxQuantity(untracked, "P")).toBe(MAX_ITEM_QUANTITY);
  });

  it("marca esgotado quando nenhum tamanho tem peças", () => {
    expect(isSoldOut({ sizes: ["P"], stock: { P: 0 } })).toBe(true);
    expect(isSoldOut(tracked)).toBe(false);
  });

  it("limita a quantidade ao estoque do tamanho", () => {
    expect(getMaxQuantity(tracked, "P")).toBe(3);
  });

  it("descarta valores inválidos vindos do banco", () => {
    expect(parseStock(null)).toBeNull();
    expect(parseStock([1, 2])).toBeNull();
    expect(parseStock({ P: 2.7, M: -1, G: "x" })).toEqual({ P: 2, M: 0 });
  });
});

describe("toStockColumn", () => {
  it("grava só os tamanhos atuais, completando com 0", () => {
    expect(toStockColumn({ trackStock: true, sizes: ["P", "M"], stock: { P: 4, GG: 9 } })).toEqual({ P: 4, M: 0 });
  });

  it("grava null quando o controle está desligado", () => {
    expect(toStockColumn({ trackStock: false, sizes: ["P"], stock: { P: 4 } })).toBeNull();
  });
});

describe("adicionar ao carrinho com estoque", () => {
  const schema = createAddToCartSchema({ sizes: tracked.sizes, colors: [], stock: tracked.stock });

  it("bloqueia tamanho esgotado", () => {
    const result = schema.safeParse({ size: "M", color: "", quantity: 1 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["size"]);
  });

  it("bloqueia quantidade acima do estoque", () => {
    const result = schema.safeParse({ size: "P", color: "", quantity: 4 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["quantity"]);
  });

  it("aceita quantidade dentro do estoque", () => {
    expect(schema.safeParse({ size: "P", color: "", quantity: 3 }).success).toBe(true);
  });
});

describe("carrinho respeita o estoque", () => {
  const item: NewCartItem = {
    productId: "p1",
    slug: "camiseta",
    name: "Camiseta",
    image: null,
    size: "P",
    color: null,
    unitPrice: 65,
    maxQuantity: 3,
  };

  it("não passa do estoque ao somar o mesmo item", () => {
    const items = addCartItem(addCartItem([], { ...item, quantity: 2 }), { ...item, quantity: 2 });
    expect(items[0].quantity).toBe(3);
  });

  it("não passa do estoque ao aumentar no carrinho", () => {
    const items = updateCartItemQuantity(addCartItem([], item), addCartItem([], item)[0].key, 10);
    expect(items[0].quantity).toBe(3);
  });
});

import {
  MAX_ITEM_QUANTITY,
  addCartItem,
  getCartCount,
  getCartTotal,
  parseStoredCart,
  removeCartItem,
  updateCartItemQuantity,
  type NewCartItem,
} from "@/lib/cart";

const shirt: NewCartItem = {
  productId: "p1",
  slug: "camiseta",
  name: "Camiseta",
  image: null,
  size: "M",
  color: "Preto",
  unitPrice: 65,
};

describe("carrinho", () => {
  it("soma a quantidade quando a mesma variação é adicionada de novo", () => {
    const items = addCartItem(addCartItem([], shirt), { ...shirt, quantity: 2 });
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it("separa variações diferentes do mesmo produto", () => {
    const items = addCartItem(addCartItem([], shirt), { ...shirt, size: "G" });
    expect(items).toHaveLength(2);
  });

  it("limita a quantidade máxima por item", () => {
    const items = addCartItem([], { ...shirt, quantity: 999 });
    expect(items[0].quantity).toBe(MAX_ITEM_QUANTITY);
  });

  it("remove o item quando a quantidade chega a zero", () => {
    const items = addCartItem([], shirt);
    expect(updateCartItemQuantity(items, items[0].key, 0)).toEqual([]);
    expect(removeCartItem(items, items[0].key)).toEqual([]);
  });

  it("calcula contagem e total", () => {
    const items = addCartItem(addCartItem([], { ...shirt, quantity: 2 }), { ...shirt, size: "G", unitPrice: 70 });
    expect(getCartCount(items)).toBe(3);
    expect(getCartTotal(items)).toBe(200);
  });

  it("ignora dados salvos inválidos", () => {
    expect(parseStoredCart("not json")).toEqual([]);
    expect(parseStoredCart('{"a":1}')).toEqual([]);
    expect(parseStoredCart('[{"foo":"bar"}]')).toEqual([]);
  });
});

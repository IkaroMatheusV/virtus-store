import { formatPrice } from "./format-price";

/** Item do carrinho usado para montar a mensagem de pedido. */
export type OrderItem = {
  name: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unitPrice: number;
};

/** Dados do cliente informados no carrinho. */
export type OrderCustomer = {
  name: string;
  city: string;
  note?: string;
};

/** Mantém apenas dígitos; adiciona DDI 55 quando o número parece brasileiro sem DDI. */
export function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const BRAZIL_LOCAL_LENGTHS = [10, 11];
  if (BRAZIL_LOCAL_LENGTHS.includes(digits.length)) return `55${digits}`;
  return digits;
}

/** Soma total do pedido. */
export function getOrderTotal(items: OrderItem[]): number {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

/** Monta o texto do pedido que será enviado no WhatsApp da loja. */
export function buildOrderMessage(items: OrderItem[], customer?: OrderCustomer): string {
  const lines = items.map((item) => {
    const details = [item.size && `Tam. ${item.size}`, item.color].filter(Boolean).join(" · ");
    const subtotal = formatPrice(item.unitPrice * item.quantity);
    return `• ${item.quantity}x ${item.name}${details ? ` (${details})` : ""} — ${subtotal}`;
  });

  const message = [
    "Olá, Virtus! Quero fazer um pedido:",
    "",
    ...lines,
    "",
    `*Total: ${formatPrice(getOrderTotal(items))}*`,
  ];

  if (customer) {
    message.push("", `Nome: ${customer.name}`, `Cidade: ${customer.city}`);
    if (customer.note?.trim()) message.push(`Observação: ${customer.note.trim()}`);
  }

  return message.join("\n");
}

/** Link wa.me com a mensagem já preenchida. */
export function buildWhatsAppUrl(number: string, message?: string): string {
  const base = `https://wa.me/${normalizeWhatsAppNumber(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

import type { Metadata } from "next";
import { SectionLabel } from "@/components/brand/section-label";
import { getStoreSettings } from "@/services/catalog";
import { CartContent } from "./_components/content";

export const metadata: Metadata = {
  title: "Carrinho",
  robots: { index: false },
};

/** Carrinho: itens salvos no navegador e envio do pedido pelo WhatsApp da loja. */
export default async function CartPage() {
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
      <header className="mb-8 flex flex-col gap-2">
        <SectionLabel>Seu pedido</SectionLabel>
        <h1 className="heading-display text-3xl md:text-5xl">Carrinho</h1>
      </header>
      <CartContent whatsappNumber={settings.whatsappNumber} shippingNote={settings.shippingNote} />
    </div>
  );
}

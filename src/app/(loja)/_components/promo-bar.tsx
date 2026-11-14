import Link from "next/link";
import { getStoreSettings } from "@/services/catalog";

/** Faixa de oferta no topo: dourado e mesma tipografia da marca (nada de vermelho). */
export async function PromoBar() {
  const { promoText } = await getStoreSettings();
  if (!promoText) return null;

  return (
    <Link
      href="/produtos?oferta=1"
      className="block border-b border-gold/40 bg-virtus-black px-4 py-2 text-center font-heading text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-gold transition-colors hover:text-gold-light"
    >
      {promoText}
    </Link>
  );
}

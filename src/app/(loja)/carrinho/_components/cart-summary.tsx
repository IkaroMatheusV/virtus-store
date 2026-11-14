import { Truck } from "lucide-react";
import { SectionLabel } from "@/components/brand/section-label";
import { formatPrice } from "@/lib/format-price";

type CartSummaryProps = {
  total: number;
  shippingNote: string;
};

/** Total do pedido; o frete é combinado pelo WhatsApp. */
export function CartSummary({ total, shippingNote }: CartSummaryProps) {
  return (
    <div className="flex flex-col gap-3">
      <SectionLabel>Resumo</SectionLabel>
      <div className="flex items-baseline justify-between">
        <span className="text-silver">Total</span>
        <span className="font-heading text-2xl font-semibold text-gold">{formatPrice(total)}</span>
      </div>
      <p className="flex items-start gap-2 text-sm text-silver-muted">
        <Truck className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
        <span>{shippingNote} O frete é calculado e combinado no WhatsApp.</span>
      </p>
    </div>
  );
}

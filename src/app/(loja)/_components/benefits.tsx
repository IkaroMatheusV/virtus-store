import { MessageCircle, Shirt, Truck } from "lucide-react";
import { GoldDivider } from "@/components/brand/gold-divider";

type BenefitsProps = {
  shippingNote: string;
  city: string;
};

/** Diferenciais da loja em três colunas com ícones de traço fino. */
export function Benefits({ shippingNote, city }: BenefitsProps) {
  const benefits = [
    { icon: Truck, title: "Envio para todo o Brasil", text: `${shippingNote} Saímos de ${city}.` },
    { icon: MessageCircle, title: "Atendimento direto", text: "Tire dúvidas de tamanho e finalize o pedido pelo WhatsApp." },
    { icon: Shirt, title: "Peças selecionadas", text: "Básicos e elegantes em preto, branco, cinza, bege e verde-oliva." },
  ];

  return (
    <section aria-label="Diferenciais" className="mx-auto max-w-7xl px-4 pt-20 md:px-8 md:pt-28">
      <GoldDivider className="mb-12" />
      <ul className="grid gap-10 md:grid-cols-3">
        {benefits.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4">
            <Icon className="mt-1 size-6 shrink-0 text-gold" strokeWidth={1.25} />
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-sm font-medium uppercase tracking-[0.2em] text-silver">{title}</h3>
              <p className="text-sm text-silver-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/brand/section-label";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Chamada final para conversar com a loja. */
export function WhatsAppCta({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 md:px-8 md:pt-28">
      <div className="concrete-surface flex flex-col items-start gap-6 rounded-sm border border-border px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12">
        <div className="flex flex-col gap-3">
          <SectionLabel>Ficou em dúvida?</SectionLabel>
          <h2 className="heading-display max-w-lg text-2xl md:text-3xl">A gente te ajuda a escolher</h2>
          <p className="max-w-md text-sm text-silver/80 md:text-base">
            Fale com a loja para saber tamanhos, cores disponíveis e prazo de entrega para a sua cidade.
          </p>
        </div>
        {whatsappNumber ? (
          <Button asChild size="lg">
            <a href={buildWhatsAppUrl(whatsappNumber)} target="_blank" rel="noopener noreferrer">
              <MessageCircle data-icon="inline-start" strokeWidth={1.5} />
              Falar no WhatsApp
            </a>
          </Button>
        ) : (
          <Button asChild size="lg">
            <Link href="/produtos">Ver produtos</Link>
          </Button>
        )}
      </div>
    </section>
  );
}

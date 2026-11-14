import Link from "next/link";
import { AtSign, MapPin, MessageCircle, Truck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { GoldDivider } from "@/components/brand/gold-divider";
import { SectionLabel } from "@/components/brand/section-label";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getStoreSettings } from "@/services/catalog";

/** Rodapé com contato, localização e acesso discreto à área VIP. */
export async function SiteFooter() {
  const settings = await getStoreSettings();
  const instagramHandle = settings.instagramHandle.replace(/^@/, "");

  return (
    <footer className="mt-24 border-t border-border bg-virtus-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-3 md:px-8">
        <div className="flex flex-col gap-4">
          <Logo size="lg" />
          <p className="max-w-xs text-sm text-silver-muted">
            Moda masculina multimarcas. Peças básicas e elegantes para o homem que se veste bem todos os dias.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SectionLabel>Atendimento</SectionLabel>
          <ul className="flex flex-col gap-3 text-sm text-silver">
            {settings.whatsappNumber && (
              <li>
                <a
                  href={buildWhatsAppUrl(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <MessageCircle className="size-4 text-gold" strokeWidth={1.5} /> WhatsApp
                </a>
              </li>
            )}
            {instagramHandle && (
              <li>
                <a
                  href={`https://instagram.com/${instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <AtSign className="size-4 text-gold" strokeWidth={1.5} /> {instagramHandle}
                </a>
              </li>
            )}
            <li className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-gold" strokeWidth={1.5} /> {settings.city}
            </li>
            <li className="inline-flex items-center gap-2">
              <Truck className="size-4 text-gold" strokeWidth={1.5} /> {settings.shippingNote}
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <SectionLabel>Loja</SectionLabel>
          <ul className="flex flex-col gap-3 text-sm text-silver">
            <li>
              <Link href="/produtos" className="transition-colors hover:text-gold">
                Todos os produtos
              </Link>
            </li>
            <li>
              <Link href="/produtos?oferta=1" className="transition-colors hover:text-gold">
                Ofertas
              </Link>
            </li>
            <li>
              <Link href="/carrinho" className="transition-colors hover:text-gold">
                Meu carrinho
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <GoldDivider className="bg-gold/20" />
        <div className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-silver-muted sm:flex-row">
          <p>© Virtus Store · {settings.city}</p>
          <Link href="/vip" className="font-heading uppercase tracking-[0.25em] transition-colors hover:text-gold">
            Área VIP
          </Link>
        </div>
      </div>
    </footer>
  );
}

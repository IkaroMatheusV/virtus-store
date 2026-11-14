import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/brand/section-label";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { StoreSettings } from "@/lib/types";

type HeroProps = {
  settings: StoreSettings;
  /** Foto do look (escolhida no painel ou de um produto em destaque); sem foto mostra o monograma. */
  heroImage: string | null;
};

/** Abertura da página: título grande em caixa alta, chamada e dois botões de ação. */
export function Hero({ settings, heroImage }: HeroProps) {
  return (
    <section className="grid-surface border-b border-border">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-24">
        <div className="flex flex-col gap-6">
          <SectionLabel>Moda masculina · {settings.city}</SectionLabel>
          <h1 className="heading-display max-w-xl text-5xl text-balance sm:text-6xl lg:text-7xl">{settings.heroTitle}</h1>
          {settings.heroSubtitle && (
            <p className="max-w-md text-base text-silver/80 md:text-lg">{settings.heroSubtitle}</p>
          )}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/produtos">Comprar agora</Link>
            </Button>
            {settings.whatsappNumber && (
              <Button asChild size="lg" variant="outline">
                <a href={buildWhatsAppUrl(settings.whatsappNumber)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle data-icon="inline-start" strokeWidth={1.5} />
                  Falar no WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div className="concrete-surface relative aspect-[4/5] overflow-hidden rounded-sm border border-border">
            {heroImage ? (
              <Image
                src={heroImage}
                alt="Look em destaque da Virtus"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
                <span className="font-heading text-[9rem] font-light leading-none tracking-[0.1em] text-gold/25 md:text-[12rem]">
                  VS
                </span>
              </div>
            )}
          </div>
          <div className="pointer-events-none absolute -bottom-3 -right-3 hidden h-full w-full rounded-sm border border-gold/40 md:block" />
        </div>
      </div>
    </section>
  );
}

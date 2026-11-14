import { SiteHeader } from "./_components/site-header";
import { SiteFooter } from "./_components/site-footer";
import { PromoBar } from "./_components/promo-bar";
import { DemoNotice } from "./_components/demo-notice";

/** Layout público da loja: faixa de promoção, cabeçalho, conteúdo e rodapé. */
export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <DemoNotice />
      <PromoBar />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}

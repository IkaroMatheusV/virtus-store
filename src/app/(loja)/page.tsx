import { getCategories, getFeaturedProducts, getSaleProducts, getStoreSettings } from "@/services/catalog";
import { Hero } from "./_components/hero";
import { CategoryStrip } from "./_components/category-strip";
import { ProductSection } from "./_components/product-section";
import { Benefits } from "./_components/benefits";
import { WhatsAppCta } from "./_components/whatsapp-cta";

const FEATURED_LIMIT = 8;
const SALE_LIMIT = 4;

/** Página inicial da loja. */
export default async function HomePage() {
  const [settings, categories, featuredProducts, saleProducts] = await Promise.all([
    getStoreSettings(),
    getCategories(),
    getFeaturedProducts(FEATURED_LIMIT),
    getSaleProducts(SALE_LIMIT),
  ]);

  // Foto escolhida no painel; sem ela, a capa do primeiro produto em destaque com foto.
  const heroImage =
    settings.heroImageUrl || (featuredProducts.find((product) => product.images.length > 0)?.images[0] ?? null);

  return (
    <>
      <Hero settings={settings} heroImage={heroImage} />
      <CategoryStrip categories={categories} />
      <ProductSection
        id="destaques"
        label="Seleção Virtus"
        title="Destaques"
        products={featuredProducts}
        href="/produtos"
        linkLabel="Ver todos"
      />
      {saleProducts.length > 0 && (
        <ProductSection
          id="ofertas"
          label="Por tempo limitado"
          title="Ofertas"
          products={saleProducts}
          href="/produtos?oferta=1"
          linkLabel="Ver ofertas"
          isHighlighted
        />
      )}
      <Benefits shippingNote={settings.shippingNote} city={settings.city} />
      <WhatsAppCta whatsappNumber={settings.whatsappNumber} />
    </>
  );
}

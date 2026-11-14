import type { Category, Product, StoreSettings } from "./types";

/**
 * Dados de demonstração usados SOMENTE quando o Supabase ainda não foi configurado
 * (sem NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). Espelham o supabase/seed.sql.
 */

export const DEFAULT_SETTINGS: StoreSettings = {
  whatsappNumber: "88981724856",
  instagramHandle: "virtusvs",
  city: "Porteiras-CE",
  shippingNote: "Enviamos para todo o Brasil.",
  heroTitle: "Vista sua melhor versão",
  heroSubtitle: "Peças selecionadas para o homem que se veste bem todos os dias. Enviamos para todo o Brasil.",
  promoText: "",
};

export const DEMO_CATEGORIES: Category[] = [
  { id: "demo-camisetas", name: "Camisetas", slug: "camisetas", sortOrder: 1 },
  { id: "demo-polos", name: "Polos", slug: "polos", sortOrder: 2 },
  { id: "demo-bermudas", name: "Bermudas", slug: "bermudas", sortOrder: 3 },
  { id: "demo-jeans", name: "Jeans", slug: "jeans", sortOrder: 4 },
  { id: "demo-bones", name: "Bonés", slug: "bones", sortOrder: 5 },
  { id: "demo-calcados", name: "Calçados", slug: "calcados", sortOrder: 6 },
];

type DemoSeed = Pick<
  Product,
  "name" | "slug" | "description" | "price" | "promoPrice" | "sizes" | "colors" | "isNew" | "isFeatured"
> & {
  categorySlug: string;
};

const DEMO_SEEDS: DemoSeed[] = [
  {
    name: "Camiseta básica premium",
    slug: "camiseta-basica-premium",
    description: "Algodão penteado 30.1, toque macio e caimento reto. A base de todo bom guarda-roupa.",
    categorySlug: "camisetas",
    price: 65,
    promoPrice: null,
    sizes: ["P", "M", "G", "GG"],
    colors: ["Preto", "Branco", "Cinza"],
    isNew: true,
    isFeatured: true,
  },
  {
    name: "Camiseta oversized concreto",
    slug: "camiseta-oversized-concreto",
    description: "Modelagem ampla, gola reforçada e malha encorpada. Visual urbano sem esforço.",
    categorySlug: "camisetas",
    price: 79.9,
    promoPrice: 69.9,
    sizes: ["M", "G", "GG"],
    colors: ["Cinza", "Bege"],
    isNew: true,
    isFeatured: false,
  },
  {
    name: "Polo piquet clássica",
    slug: "polo-piquet-classica",
    description: "Piquet de algodão com acabamento em ribana. Elegante no trabalho e no fim de semana.",
    categorySlug: "polos",
    price: 119.9,
    promoPrice: null,
    sizes: ["P", "M", "G", "GG"],
    colors: ["Preto", "Verde-oliva", "Branco"],
    isNew: false,
    isFeatured: true,
  },
  {
    name: "Bermuda sarja slim",
    slug: "bermuda-sarja-slim",
    description: "Sarja com elastano, corte slim acima do joelho. Conforto para o dia inteiro.",
    categorySlug: "bermudas",
    price: 99.9,
    promoPrice: 84.9,
    sizes: ["38", "40", "42", "44"],
    colors: ["Bege", "Verde-oliva", "Preto"],
    isNew: false,
    isFeatured: true,
  },
  {
    name: "Calça jeans slim escura",
    slug: "calca-jeans-slim-escura",
    description: "Jeans com leve elasticidade, lavagem escura e barra italiana.",
    categorySlug: "jeans",
    price: 159.9,
    promoPrice: null,
    sizes: ["38", "40", "42", "44", "46"],
    colors: ["Azul escuro"],
    isNew: true,
    isFeatured: true,
  },
  {
    name: "Boné aba curva preto",
    slug: "bone-aba-curva-preto",
    description: "Sarja estruturada, regulagem em metal e bordado discreto.",
    categorySlug: "bones",
    price: 59.9,
    promoPrice: null,
    sizes: ["Único"],
    colors: ["Preto", "Bege"],
    isNew: false,
    isFeatured: false,
  },
  {
    name: "Tênis casual couro",
    slug: "tenis-casual-couro",
    description: "Couro legítimo, solado de borracha e palmilha acolchoada.",
    categorySlug: "calcados",
    price: 249.9,
    promoPrice: 219.9,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Branco", "Preto"],
    isNew: true,
    isFeatured: true,
  },
  {
    name: "Camiseta henley manga longa",
    slug: "camiseta-henley-manga-longa",
    description: "Gola com botões, malha canelada e punho ajustado. Sobriedade para noites frescas.",
    categorySlug: "camisetas",
    price: 89.9,
    promoPrice: null,
    sizes: ["P", "M", "G"],
    colors: ["Verde-oliva", "Preto"],
    isNew: false,
    isFeatured: false,
  },
];

export const DEMO_PRODUCTS: Product[] = DEMO_SEEDS.map(({ categorySlug, ...seed }) => {
  const category = DEMO_CATEGORIES.find((item) => item.slug === categorySlug) ?? null;
  return {
    ...seed,
    id: `demo-${seed.slug}`,
    categoryId: category?.id ?? null,
    categoryName: category?.name ?? null,
    categorySlug: category?.slug ?? null,
    images: [],
    isActive: true,
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
});

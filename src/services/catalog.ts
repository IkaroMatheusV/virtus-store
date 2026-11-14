import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { DEFAULT_SETTINGS, DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/lib/demo-data";
import { isOnSale } from "@/lib/format-price";
import {
  PRODUCT_SELECT,
  mapCategory,
  mapProduct,
  mapSettings,
  type CategoryRow,
  type ProductRow,
  type SettingsRow,
} from "@/lib/mappers";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Category, Product, StoreSettings } from "@/lib/types";

/** Produtos ativos, mais recentes primeiro. Leitura pública e cacheada. */
export async function getActiveProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.products);

  const supabase = createPublicClient();
  if (!supabase) return DEMO_PRODUCTS;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .overrideTypes<ProductRow[], { merge: false }>();

  if (error) {
    console.error("[catalog] erro ao buscar produtos:", error.message);
    return [];
  }
  return data.map(mapProduct);
}

/** Produto ativo pelo slug (ou null). */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getActiveProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

/** Produtos em destaque para a home; completa com os mais recentes se houver poucos. */
export async function getFeaturedProducts(limit: number): Promise<Product[]> {
  const products = await getActiveProducts();
  const featured = products.filter((product) => product.isFeatured);
  const others = products.filter((product) => !product.isFeatured);
  return [...featured, ...others].slice(0, limit);
}

/** Produtos em oferta. */
export async function getSaleProducts(limit: number): Promise<Product[]> {
  const products = await getActiveProducts();
  return products.filter((product) => isOnSale(product.price, product.promoPrice)).slice(0, limit);
}

/** Produtos relacionados (mesma categoria, exceto o atual). */
export async function getRelatedProducts(product: Product, limit: number): Promise<Product[]> {
  const products = await getActiveProducts();
  return products
    .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
    .slice(0, limit);
}

/** Categorias ordenadas. */
export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.categories);

  const supabase = createPublicClient();
  if (!supabase) return DEMO_CATEGORIES;

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .order("sort_order")
    .overrideTypes<CategoryRow[], { merge: false }>();

  if (error) {
    console.error("[catalog] erro ao buscar categorias:", error.message);
    return [];
  }
  return data.map(mapCategory);
}

/** Configurações públicas da loja (WhatsApp, Instagram, textos). */
export async function getStoreSettings(): Promise<StoreSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.settings);

  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase
    .from("store_settings")
    .select("whatsapp_number, instagram_handle, city, shipping_note, hero_title, hero_subtitle, promo_text, hero_image_url")
    .eq("id", 1)
    .maybeSingle<SettingsRow>();

  if (error || !data) {
    if (error) console.error("[catalog] erro ao buscar configurações:", error.message);
    return DEFAULT_SETTINGS;
  }
  return mapSettings(data);
}

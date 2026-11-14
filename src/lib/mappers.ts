import type { Category, Product, StoreSettings } from "./types";

/** Linha de produto como vem do Supabase (com a categoria embutida). */
export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  price: number | string;
  promo_price: number | string | null;
  sizes: string[] | null;
  colors: string[] | null;
  images: string[] | null;
  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;
  updated_at: string;
  category: { name: string; slug: string } | null;
};

export type CategoryRow = { id: string; name: string; slug: string; sort_order: number };

export type SettingsRow = {
  whatsapp_number: string;
  instagram_handle: string;
  city: string;
  shipping_note: string;
  hero_title: string;
  hero_subtitle: string;
  promo_text: string;
};

/** Colunas pedidas ao Supabase para montar um Product. */
export const PRODUCT_SELECT =
  "id, name, slug, description, category_id, price, promo_price, sizes, colors, images, is_new, is_featured, is_active, updated_at, category:categories(name, slug)";

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    categoryId: row.category_id,
    categoryName: row.category?.name ?? null,
    categorySlug: row.category?.slug ?? null,
    price: Number(row.price),
    promoPrice: row.promo_price === null ? null : Number(row.promo_price),
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    images: row.images ?? [],
    isNew: row.is_new,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    updatedAt: row.updated_at,
  };
}

export function mapCategory(row: CategoryRow): Category {
  return { id: row.id, name: row.name, slug: row.slug, sortOrder: row.sort_order };
}

export function mapSettings(row: SettingsRow): StoreSettings {
  return {
    whatsappNumber: row.whatsapp_number,
    instagramHandle: row.instagram_handle,
    city: row.city,
    shippingNote: row.shipping_note,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
    promoText: row.promo_text,
  };
}

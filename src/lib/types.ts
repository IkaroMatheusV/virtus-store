/** Categoria de produto exibida na navegação e nos filtros. */
export type Category = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

/** Produto como usado pela UI (camelCase, preços em número). */
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  price: number;
  promoPrice: number | null;
  sizes: string[];
  colors: string[];
  images: string[];
  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;
  updatedAt: string;
};

/** Configurações editáveis pelo dono no painel VIP. */
export type StoreSettings = {
  whatsappNumber: string;
  instagramHandle: string;
  city: string;
  shippingNote: string;
  heroTitle: string;
  heroSubtitle: string;
  promoText: string;
};

/** Resultado padrão das Server Actions. */
export type ActionResult<TData = undefined> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  data?: TData;
};

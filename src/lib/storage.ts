/** Bucket público do Supabase Storage com as fotos dos produtos. */
export const PRODUCT_IMAGES_BUCKET = "product-images";

/** Tipos e tamanho aceitos no upload (igual à configuração do bucket na migração). */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

/** Extrai o caminho do arquivo a partir da URL pública do Storage (ou null se não for do bucket). */
export function getStoragePathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

/** Pasta do bucket com as fotos do look da página inicial. */
export const HERO_IMAGES_FOLDER = "hero";

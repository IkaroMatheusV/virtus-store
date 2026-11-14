import "server-only";
import { requireVip } from "@/lib/auth";
import { PRODUCT_SELECT, mapProduct, type ProductRow } from "@/lib/mappers";
import { createSessionClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Produto (ativo ou oculto) para edição no painel VIP. */
export async function getProductById(id: string): Promise<Product | null> {
  await requireVip();
  if (!UUID_PATTERN.test(id)) return null;

  const supabase = await createSessionClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle<ProductRow>();

  if (error) throw new Error(`Erro ao carregar produto: ${error.message}`);
  return data ? mapProduct(data) : null;
}

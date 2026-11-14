import "server-only";
import { requireVip } from "@/lib/auth";
import { PRODUCT_SELECT, mapProduct, type ProductRow } from "@/lib/mappers";
import { createSessionClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

/** Todos os produtos (ativos e ocultos) para o painel VIP. */
export async function getVipProducts(): Promise<Product[]> {
  await requireVip();
  const supabase = await createSessionClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false })
    .overrideTypes<ProductRow[], { merge: false }>();

  if (error) throw new Error(`Erro ao carregar produtos: ${error.message}`);
  return data.map(mapProduct);
}

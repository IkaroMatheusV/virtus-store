-- =============================================================
-- Virtus Store — estoque por tamanho + foto do look da página inicial
-- Pode rodar mais de uma vez.
-- =============================================================

-- Estoque por tamanho, ex.: {"P": 3, "M": 5, "G": 0}.
-- null = estoque não controlado (produto sempre disponível).
alter table public.products
  add column if not exists stock jsonb;

alter table public.products
  drop constraint if exists products_stock_is_object;
alter table public.products
  add constraint products_stock_is_object
  check (stock is null or jsonb_typeof(stock) = 'object');

-- Foto do look em destaque na página inicial ('' = usa a foto de um produto em destaque).
alter table public.store_settings
  add column if not exists hero_image_url text not null default '';

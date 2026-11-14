-- =============================================================
-- Virtus Store — INSTALAÇÃO COMPLETA (cole tudo no SQL Editor e clique em Run)
-- Gerado a partir de migrations/0001_init.sql + seed.sql + 0002_estoque_e_foto_look.sql. Pode rodar mais de uma vez.
-- =============================================================

-- =============================================================
-- Virtus Store — schema inicial
-- Rode este arquivo no SQL Editor do Supabase (ou via supabase db push).
-- =============================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- Categorias
-- -------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------
-- Produtos
-- -------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique,
  description text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  price numeric(10, 2) not null check (price >= 0),
  promo_price numeric(10, 2) check (promo_price is null or promo_price >= 0),
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  images text[] not null default '{}',
  is_new boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (is_active, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------
-- Configurações da loja (linha única, id = 1)
-- -------------------------------------------------------------
create table if not exists public.store_settings (
  id int primary key default 1 check (id = 1),
  whatsapp_number text not null default '',
  instagram_handle text not null default '',
  city text not null default 'Porteiras-CE',
  shipping_note text not null default 'Enviamos para todo o Brasil.',
  hero_title text not null default 'Vista sua melhor versão',
  hero_subtitle text not null default 'Peças selecionadas para o homem que se veste bem todos os dias. Enviamos para todo o Brasil.',
  promo_text text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id) values (1)
on conflict (id) do nothing;

-- -------------------------------------------------------------
-- Usuários VIP (dono da loja)
-- -------------------------------------------------------------
create table if not exists public.vip_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_vip()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.vip_users where user_id = auth.uid());
$$;

-- -------------------------------------------------------------
-- Row Level Security
-- -------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.store_settings enable row level security;
alter table public.vip_users enable row level security;

-- categorias: leitura pública, escrita VIP
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (true);
drop policy if exists "categories_vip_write" on public.categories;
create policy "categories_vip_write" on public.categories
  for all using (public.is_vip()) with check (public.is_vip());

-- produtos: público vê só ativos; VIP vê e altera tudo
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (is_active or public.is_vip());
drop policy if exists "products_vip_insert" on public.products;
create policy "products_vip_insert" on public.products
  for insert with check (public.is_vip());
drop policy if exists "products_vip_update" on public.products;
create policy "products_vip_update" on public.products
  for update using (public.is_vip()) with check (public.is_vip());
drop policy if exists "products_vip_delete" on public.products;
create policy "products_vip_delete" on public.products
  for delete using (public.is_vip());

-- configurações: leitura pública, escrita VIP
drop policy if exists "settings_public_read" on public.store_settings;
create policy "settings_public_read" on public.store_settings
  for select using (true);
drop policy if exists "settings_vip_write" on public.store_settings;
create policy "settings_vip_write" on public.store_settings
  for update using (public.is_vip()) with check (public.is_vip());

-- vip_users: cada usuário só enxerga a própria linha (sem escrita pelo app)
drop policy if exists "vip_users_self_read" on public.vip_users;
create policy "vip_users_self_read" on public.vip_users
  for select using (user_id = auth.uid());

-- -------------------------------------------------------------
-- Storage: fotos dos produtos
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');
drop policy if exists "product_images_vip_insert" on storage.objects;
create policy "product_images_vip_insert" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_vip());
drop policy if exists "product_images_vip_update" on storage.objects;
create policy "product_images_vip_update" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_vip());
drop policy if exists "product_images_vip_delete" on storage.objects;
create policy "product_images_vip_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_vip());


-- =============================================================
-- Virtus Store — dados iniciais (rode depois de 0001_init.sql)
-- Os produtos são exemplos: edite ou exclua pelo painel VIP.
-- =============================================================

insert into public.store_settings (id, whatsapp_number, instagram_handle)
values (1, '88981724856', 'virtusvs')
on conflict (id) do update
  set whatsapp_number = excluded.whatsapp_number,
      instagram_handle = excluded.instagram_handle;

insert into public.categories (name, slug, sort_order) values
  ('Camisetas', 'camisetas', 1),
  ('Polos', 'polos', 2),
  ('Bermudas', 'bermudas', 3),
  ('Jeans', 'jeans', 4),
  ('Bonés', 'bones', 5),
  ('Calçados', 'calcados', 6)
on conflict (slug) do nothing;

insert into public.products
  (name, slug, description, category_id, price, promo_price, sizes, colors, is_new, is_featured)
select p.name, p.slug, p.description, c.id, p.price, p.promo_price, p.sizes, p.colors, p.is_new, p.is_featured
from (values
  ('Camiseta básica premium', 'camiseta-basica-premium',
   'Algodão penteado 30.1, toque macio e caimento reto. A base de todo bom guarda-roupa.',
   'camisetas', 65.00, null::numeric, array['P','M','G','GG'], array['Preto','Branco','Cinza'], true, true),
  ('Camiseta oversized concreto', 'camiseta-oversized-concreto',
   'Modelagem ampla, gola reforçada e malha encorpada. Visual urbano sem esforço.',
   'camisetas', 79.90, 69.90, array['M','G','GG'], array['Cinza','Bege'], true, false),
  ('Polo piquet clássica', 'polo-piquet-classica',
   'Piquet de algodão com acabamento em ribana. Elegante no trabalho e no fim de semana.',
   'polos', 119.90, null, array['P','M','G','GG'], array['Preto','Verde-oliva','Branco'], false, true),
  ('Bermuda sarja slim', 'bermuda-sarja-slim',
   'Sarja com elastano, corte slim acima do joelho. Conforto para o dia inteiro.',
   'bermudas', 99.90, 84.90, array['38','40','42','44'], array['Bege','Verde-oliva','Preto'], false, true),
  ('Calça jeans slim escura', 'calca-jeans-slim-escura',
   'Jeans com leve elasticidade, lavagem escura e barra italiana.',
   'jeans', 159.90, null, array['38','40','42','44','46'], array['Azul escuro'], true, true),
  ('Boné aba curva preto', 'bone-aba-curva-preto',
   'Sarja estruturada, regulagem em metal e bordado discreto.',
   'bones', 59.90, null, array['Único'], array['Preto','Bege'], false, false),
  ('Tênis casual couro', 'tenis-casual-couro',
   'Couro legítimo, solado de borracha e palmilha acolchoada.',
   'calcados', 249.90, 219.90, array['39','40','41','42','43'], array['Branco','Preto'], true, true),
  ('Camiseta henley manga longa', 'camiseta-henley-manga-longa',
   'Gola com botões, malha canelada e punho ajustado. Sobriedade para noites frescas.',
   'camisetas', 89.90, null, array['P','M','G'], array['Verde-oliva','Preto'], false, false)
) as p(name, slug, description, category_slug, price, promo_price, sizes, colors, is_new, is_featured)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;


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

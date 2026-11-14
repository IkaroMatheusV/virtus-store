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

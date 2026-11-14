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

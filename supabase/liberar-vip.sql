-- =============================================================
-- Virtus Store — libera o acesso VIP do dono
-- Rode DEPOIS de: (1) instalar.sql e (2) criar o usuário em
-- Authentication → Users → Add user (com "Auto Confirm User" marcado).
-- =============================================================

insert into public.vip_users (user_id)
select id from auth.users where email = 'virtusvsadmin@gmail.com'
on conflict (user_id) do nothing;

-- Conferência: deve retornar 1 linha com o e-mail do dono.
select u.email, v.created_at as vip_desde
from public.vip_users v
join auth.users u on u.id = v.user_id;

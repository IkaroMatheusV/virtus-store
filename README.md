# Virtus Store

Loja online de moda masculina da **Virtus** (Porteiras-CE), com a identidade **Preto, Ouro e Prata**.

- **Cliente:** navega pelas categorias, escolhe tamanho/cor, monta o carrinho e **finaliza o pedido pelo WhatsApp** da loja (mensagem já pronta com itens, tamanhos e total).
- **Dono (Área VIP):** entra em `/vip`, cadastra/edita/oculta/exclui produtos com fotos, marca destaques e ofertas e altera WhatsApp, Instagram e os textos da página inicial — sem mexer em código.

Stack: Next.js 16 (App Router + Cache Components), Tailwind v4, shadcn/ui (Radix), React Hook Form + Zod, Supabase (Postgres, Auth e Storage), Jest + Testing Library.

---

## 1. Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000. **Sem o Supabase configurado a loja roda em modo demonstração** (produtos de exemplo, sem fotos) — útil para ver o visual. O painel VIP só funciona com o Supabase.

## 2. Configurar o Supabase (catálogo real + Área VIP)

1. Crie um projeto grátis em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode `supabase/instalar.sql` (junta `migrations/0001_init.sql` + `seed.sql`: tabelas, regras de segurança, bucket de fotos, categorias e 8 produtos de exemplo).
3. Em **Project Settings → API**, copie a URL e a chave pública e crie o arquivo `.env.local` a partir do `.env.example`:

   ```bash
   cp .env.example .env.local
   ```

4. Em **Authentication → Sign In / Providers**, desative "Allow new users to sign up" (só o dono deve ter conta).
5. Crie o usuário do dono em **Authentication → Users → Add user** (e-mail + senha, marque "Auto Confirm").
6. Dê acesso VIP a ele no SQL Editor (pronto em `supabase/liberar-vip.sql`):

   ```sql
   insert into public.vip_users (user_id)
   select id from auth.users where email = 'email-do-dono@exemplo.com';
   ```

7. Reinicie o `npm run dev` e entre em http://localhost:3000/vip.

> Segurança: as tabelas usam **Row Level Security**. Visitantes só leem produtos ativos; criar, editar, excluir e enviar fotos só é permitido para quem está em `vip_users`. Cada Server Action também confere o acesso VIP no servidor.

## 3. Personalizar

| O quê | Onde |
| --- | --- |
| **Logo oficial** | ✅ Emblema VS em `public/logo.png` (PNG transparente, 788×1004). Ícone da aba em `src/app/icon.png` e `apple-icon.png`. O nome "Virtus Store" ao lado é texto, em `src/components/brand/logo.tsx`. |
| WhatsApp, Instagram, cidade, textos da home, faixa de promoção | Painel VIP → **Configurações** |
| Produtos, fotos, preços, ofertas, destaques | Painel VIP → **Produtos** |
| Cores e tipografia | `src/app/globals.css` (tokens `--color-gold`, `--color-silver`, …) |

Regras da marca já aplicadas: fundo #0B0B0C, cards #17171A, ouro #C2A464 só em botões/preços/destaques, títulos Montserrat em caixa alta com espaçamento largo, texto Inter, cantos de 2–6 px, divisores dourados finos, fotos 4:5 sobre concreto e ofertas em dourado (nunca vermelho).

## 4. Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Gera os tipos de rota e roda o TypeScript |
| `npm test` | Testes (Jest + Testing Library) |

## 5. Publicar (Vercel)

1. Suba o projeto para um repositório no GitHub e importe na [Vercel](https://vercel.com).
2. Cadastre `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` em **Settings → Environment Variables**.
3. Deploy. Alterações feitas no painel VIP aparecem na loja na hora (cache invalidado por tags).

## 6. Estrutura

```
src/
  proxy.ts                      # protege /vip (redireciona para o login)
  app/
    (loja)/                     # site público: home, /produtos, /produtos/[slug], /carrinho
    vip/login/                  # login do dono
    vip/(painel)/               # painel: produtos, novo/editar produto, configurações
      _actions/ _data-access/ _components/
  components/  brand/ product/ cart/ ui/(shadcn)
  hooks/       use-cart (localStorage), use-image-upload (Supabase Storage)
  services/    catalog.ts — leituras públicas cacheadas ("use cache" + cacheTag)
  lib/         schemas Zod, auth (requireVip), supabase, whatsapp, carrinho, filtros
supabase/      migrations/0001_init.sql, seed.sql
```

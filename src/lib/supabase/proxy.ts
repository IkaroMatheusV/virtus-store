import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

const VIP_LOGIN_PATH = "/vip/login";

/**
 * Renova a sessão do Supabase a cada requisição em /vip e faz a checagem otimista:
 * sem usuário logado → redireciona para o login VIP. A autorização real (is_vip) é feita no servidor.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = getSupabaseEnv();
  if (!env) return response;

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === VIP_LOGIN_PATH;

  if (!user && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = VIP_LOGIN_PATH;
    return NextResponse.redirect(loginUrl);
  }

  if (user && isLoginPage) {
    const panelUrl = request.nextUrl.clone();
    panelUrl.pathname = "/vip";
    return NextResponse.redirect(panelUrl);
  }

  return response;
}

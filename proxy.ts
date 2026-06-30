import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAuthBypassEnabled } from "@/lib/auth/bypass";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ドメインリダイレクト（既存）
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0];
  if (
    (hostname === "taxidriver-beginner.com" || hostname === "www.taxidriver-beginner.com") &&
    pathname === "/"
  ) {
    return NextResponse.redirect(new URL("/taxi", request.url), { status: 301 });
  }

  // takanaga-crm ドメイン: ルートは管理画面へリダイレクト
  if (hostname.includes("takanaga-crm") && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 認証バイパス（ローカル開発 / Vercel Preview のみ有効、Production は絶対スキップしない）
  if (isAuthBypassEnabled()) {
    if (pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Supabase 未設定の場合は認証チェックをスキップ（開発用フォールバック）
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname === "/admin/login" && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname !== "/admin/login" && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};

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

  // ── takanagakensetu.com のURL構成（2026-07-04切替） ──────────────────
  // / = コーポレートHP、/takanaga = 外構広告LP。
  // next.config.ts の beforeFiles rewrite はマッチ後も評価が続き
  // 「/ → /takanaga → /gaikou」と連鎖してしまうため、この2つの
  // 書き換えはミドルウェアで排他的に処理する（リダイレクトではないためループしない）。
  const isTakanagaHost =
    hostname === "takanagakensetu.com" || hostname === "www.takanagakensetu.com";
  if (isTakanagaHost && pathname === "/") {
    return NextResponse.rewrite(new URL("/takanaga", request.url));
  }
  if (isTakanagaHost && pathname === "/takanaga") {
    return NextResponse.rewrite(new URL("/gaikou", request.url));
  }

  // ── adofy のルート ──────────────────────────────────────────────────
  // adofy-site.com     = コーポレートサイト
  // lp.adofy-site.com  = 建設業特化LP
  // takanaga と同じ理由で beforeFiles ではなくここで排他的に書き換える。
  const isAdofyCorpHost =
    hostname === "adofy-site.com" || hostname === "www.adofy-site.com";
  if (isAdofyCorpHost && pathname === "/") {
    return NextResponse.rewrite(new URL("/adofy-corp", request.url));
  }
  if (hostname === "lp.adofy-site.com" && pathname === "/") {
    return NextResponse.rewrite(new URL("/adofy", request.url));
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
  matcher: ["/", "/takanaga", "/admin/:path*"],
};

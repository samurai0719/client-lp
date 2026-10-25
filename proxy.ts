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

  // ── 採用レスキュー（saiyo.adofy-site.com） ────────────────────────────
  if (hostname === "saiyo.adofy-site.com" && pathname === "/") {
    return NextResponse.rewrite(new URL("/saiyo-rescue", request.url));
  }

  // ── ドラテク 企業向けLP（doratech.adofy-site.com） ─────────────────────
  // / = 企業向けLP（物理ルート /driver/company）。下層ページは next.config.ts の rewrite で処理する
  if (hostname === "doratech.adofy-site.com" && pathname === "/") {
    return NextResponse.rewrite(new URL("/driver/company", request.url));
  }

  // ── ドラテク 営業メール管理 ────────────────────────────────────────
  // /admin/outreach/* は adofy 管理画面（/adofy-admin/outreach/*）へ。
  // 下の /admin 用ログインチェックより先に処理し、高長建設のログイン画面へ飛ばさない。
  // （next.config.ts の redirects にも同じ設定があるが、評価順に依存しないようここでも処理する）
  if (pathname === "/admin/outreach" || pathname.startsWith("/admin/outreach/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/admin\/outreach/, "/adofy-admin/outreach");
    return NextResponse.redirect(url, 307);
  }

  // ── ドライバー採用サービス 候補者プロフィール検索（scout.adofy-site.com） ─────
  if (hostname === "scout.adofy-site.com" && pathname === "/") {
    return NextResponse.rewrite(new URL("/driver/scout", request.url));
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

  // /admin と /adofy-admin はログイン必須（権限の細かい判定は各ルート側で行う）
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/adofy-admin")) {
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
  if (pathname === "/adofy-admin/login" && user) {
    return NextResponse.redirect(new URL("/adofy-admin", request.url));
  }

  // adofy側は adofy専用のログイン画面へ送る（高長建設の画面を見せない）
  const isAdofyAdmin = pathname.startsWith("/adofy-admin");
  if (isAdofyAdmin) {
    if (pathname !== "/adofy-admin/login" && !user) {
      // ログイン後に元の画面（営業メール管理など）へ戻れるよう、行き先を渡す
      const login = new URL("/adofy-admin/login", request.url);
      if (pathname !== "/adofy-admin") login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    return supabaseResponse;
  }

  if (pathname !== "/admin/login" && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", "/takanaga", "/admin/:path*", "/adofy-admin/:path*"],
};

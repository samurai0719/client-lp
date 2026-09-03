"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/check";

/*
  adofy専用のログイン画面。
  高長建設の /admin/login とは別に用意している。
  共用にすると adofy から入った人にも高長建設の名前が出てしまうため。
  認証基盤（Supabase Auth）は同じなので、アカウントは共通。
*/
export default function AdofyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const supabaseReady = isSupabaseConfigured();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!supabaseReady) {
      router.push("/adofy-admin");
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError("メールアドレスまたはパスワードが正しくありません");
      return;
    }
    router.push("/adofy-admin");
    router.refresh();
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    if (!supabaseReady) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/admin/reset-password`,
    });
    setLoading(false);
    setResetSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b2440]">
            <span className="text-xl font-bold text-white">ad</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">adofy 管理画面</h1>
          <p className="mt-1 text-sm text-slate-500">管理者ログイン</p>
        </div>

        {!showReset ? (
          <form
            onSubmit={handleLogin}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <label htmlFor="adofy-email" className="mb-1.5 block text-sm font-semibold text-slate-900">
                メールアドレス
              </label>
              <input
                id="adofy-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-[#f26a1b] focus:ring-2 focus:ring-[#f26a1b]/20"
              />
            </div>
            <div>
              <label htmlFor="adofy-password" className="mb-1.5 block text-sm font-semibold text-slate-900">
                パスワード
              </label>
              <input
                id="adofy-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none focus:border-[#f26a1b] focus:ring-2 focus:ring-[#f26a1b]/20"
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-rose-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0b2440] py-3 text-sm font-bold text-white transition-colors hover:bg-[#123457] disabled:opacity-60"
            >
              {loading ? "ログイン中…" : "ログイン"}
            </button>
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="mt-1 w-full text-center text-xs text-slate-500 hover:text-slate-800"
            >
              パスワードをお忘れの方
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleReset}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-sm font-bold text-slate-900">パスワードリセット</h2>
            {resetSent ? (
              <p className="text-sm text-emerald-700">
                リセット用メールを送信しました。メールをご確認ください。
              </p>
            ) : (
              <>
                <div>
                  <label htmlFor="adofy-reset-email" className="mb-1.5 block text-sm font-semibold text-slate-900">
                    メールアドレス
                  </label>
                  <input
                    id="adofy-reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-[#f26a1b] focus:ring-2 focus:ring-[#f26a1b]/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#0b2440] py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  {loading ? "送信中…" : "リセットメールを送信"}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowReset(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
            >
              ログインへ戻る
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

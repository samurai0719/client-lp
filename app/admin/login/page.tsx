"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/check";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const supabaseReady = isSupabaseConfigured();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!supabaseReady) {
      // dev mode: mock login
      router.push("/admin");
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError("メールアドレスまたはパスワードが正しくありません");
    } else {
      router.push("/admin");
      router.refresh();
    }
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
    <div className="min-h-screen flex items-center justify-center bg-[#f8f6ef] px-4">
      <div className="w-full max-w-sm">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#174f3f] mb-4">
            <span className="text-white text-2xl font-bold">TN</span>
          </div>
          <h1 className="text-xl font-bold text-[#10302a]">高長建設 顧客管理</h1>
          <p className="text-sm text-[#6b7a73] mt-1">管理者ログイン</p>
        </div>

        {!supabaseReady && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <strong>開発モード：</strong>Supabase 環境変数が未設定のため認証をスキップします。
            何でも入力してログインできます。
          </div>
        )}

        {!showReset ? (
          <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-[#e7e3d8] p-6 space-y-4 shadow-sm">
            <div>
              <label className="block text-sm font-semibold text-[#10302a] mb-1.5">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-[#dcd6c4] bg-white px-4 py-3 text-sm text-[#1c2b25] outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#10302a] mb-1.5">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-[#dcd6c4] bg-white px-4 py-3 text-sm text-[#1c2b25] outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#174f3f] text-white text-sm font-semibold hover:bg-[#1f6450] disabled:opacity-60 transition-colors"
            >
              {loading ? "ログイン中…" : "ログイン"}
            </button>
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="w-full text-xs text-[#6b7a73] hover:text-[#2f7d5a] text-center mt-1"
            >
              パスワードをお忘れの方
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="bg-white rounded-2xl border border-[#e7e3d8] p-6 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#10302a]">パスワードリセット</h2>
            {resetSent ? (
              <p className="text-sm text-[#2f7d5a]">
                リセット用メールを送信しました。メールをご確認ください。
              </p>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[#10302a] mb-1.5">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#dcd6c4] bg-white px-4 py-3 text-sm outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#174f3f] text-white text-sm font-semibold hover:bg-[#1f6450] disabled:opacity-60 transition-colors"
                >
                  {loading ? "送信中…" : "リセットメールを送信"}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowReset(false)}
              className="w-full text-xs text-[#6b7a73] hover:text-[#2f7d5a] text-center"
            >
              ログインへ戻る
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

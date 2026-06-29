// 認証スキップ判定 — ここで一元管理する
// Production では AUTH_BYPASS_ENABLED=true が設定されていても絶対にスキップしない

export const DEV_ADMIN_USER = {
  id: "dev-admin-user",
  email: "dev-admin@localhost",
  displayName: "開発用管理者",
  role: "admin",
} as const;

export function isAuthBypassEnabled(): boolean {
  // Production は絶対スキップしない
  if (process.env.VERCEL_ENV === "production") {
    if (process.env.AUTH_BYPASS_ENABLED === "true") {
      console.warn(
        "[SECURITY] AUTH_BYPASS_ENABLED=true が Production に設定されていますが、認証は有効のまま維持されます。"
      );
    }
    return false;
  }

  const bypassRequested = process.env.AUTH_BYPASS_ENABLED === "true";
  const isLocalDevelopment = process.env.NODE_ENV === "development";
  const isVercelPreview = process.env.VERCEL_ENV === "preview";

  return bypassRequested && (isLocalDevelopment || isVercelPreview);
}

export function isDemoDataEnabled(): boolean {
  // Production は絶対にデモデータを使わない
  if (process.env.VERCEL_ENV === "production") {
    if (process.env.DEMO_DATA_ENABLED === "true") {
      console.warn(
        "[SECURITY] DEMO_DATA_ENABLED=true が Production に設定されていますが、実データを使用します。"
      );
    }
    return false;
  }

  return (
    process.env.DEMO_DATA_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_DEMO_DATA_ENABLED === "true"
  );
}

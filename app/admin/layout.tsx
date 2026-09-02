import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import ServiceWorkerRegistrar from "@/components/admin/ServiceWorkerRegistrar";
import { AdminBrandProvider } from "@/components/admin/brand";
import { brandForHost } from "@/lib/admin/brand";

/*
  管理画面は高長建設のCRMと adofy の相談管理を兼ねているため、
  アクセス元のドメインでタイトル・アイコン名を切り替える。
    takanaga-crm.*  → 高長建設 顧客管理
    adofy-site.com  → adofy 管理画面
*/
export async function generateMetadata(): Promise<Metadata> {
  const brand = brandForHost((await headers()).get("host"));
  const title = `${brand.name} ${brand.subtitle}`;

  return {
    title,
    description: `${brand.name}の問い合わせ・顧客管理システム`,
    manifest: "/admin-manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title,
    },
    formatDetection: { telephone: false },
    other: {
      "apple-mobile-web-app-capable": "yes",
      "mobile-web-app-capable": "yes",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#174f3f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const brand = brandForHost((await headers()).get("host"));

  return (
    <AdminBrandProvider brand={brand}>
      <ServiceWorkerRegistrar />
      {children}
    </AdminBrandProvider>
  );
}

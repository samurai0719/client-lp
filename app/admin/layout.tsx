import type { Metadata, Viewport } from "next";
import ServiceWorkerRegistrar from "@/components/admin/ServiceWorkerRegistrar";
import { AdminBrandProvider, type AdminBrand } from "@/components/admin/brand";
import { CRM_COMPANIES, requireCrmAdmin } from "@/lib/crm/company";
import { createClient } from "@/lib/supabase/server";

// 高長建設と株式会社イレブンで同じ管理画面を使うので、ログインした人の会社名を出す
async function currentBrand(): Promise<AdminBrand> {
  const admin = await requireCrmAdmin(await createClient()).catch(() => null);
  return admin ? CRM_COMPANIES[admin.company] : null;
}

export async function generateMetadata(): Promise<Metadata> {
  const brand = await currentBrand();
  const title = brand ? `${brand.name} 顧客管理` : "外構 顧客管理";
  return {
    title,
    description: "外構の問い合わせ・顧客管理システム",
    manifest: "/admin-manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: brand ? `${brand.name} CRM` : "顧客管理",
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
  return (
    <AdminBrandProvider brand={await currentBrand()}>
      <ServiceWorkerRegistrar />
      {children}
    </AdminBrandProvider>
  );
}

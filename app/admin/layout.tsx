import type { Metadata, Viewport } from "next";
import ServiceWorkerRegistrar from "@/components/admin/ServiceWorkerRegistrar";

// この管理画面は高長建設専用。提携先の外構業者もログインするため、
// 他社（adofy）のデータをここから見られる導線を作らないこと。
// adofy の相談管理は /adofy-admin に分離してある。
export const metadata: Metadata = {
  title: "高長建設 顧客管理",
  description: "高長建設の外構問い合わせ・顧客管理システム",
  manifest: "/admin-manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "高長CRM" },
  formatDetection: { telephone: false },
  other: { "apple-mobile-web-app-capable": "yes", "mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  themeColor: "#174f3f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceWorkerRegistrar />
      {children}
    </>
  );
}

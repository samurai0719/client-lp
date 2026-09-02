"use client";

import { createContext, useContext, type ReactNode } from "react";
import { TAKANAGA_BRAND, type AdminBrand } from "@/lib/admin/brand";

/*
  サーバー側（app/admin/layout.tsx）で判定した表示ブランドを配るだけの層。
  クライアントでホスト名を見ないのは、ハイドレーションのズレを防ぐため。
*/
const BrandContext = createContext<AdminBrand>(TAKANAGA_BRAND);

export function AdminBrandProvider({
  brand,
  children,
}: {
  brand: AdminBrand;
  children: ReactNode;
}) {
  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useAdminBrand(): AdminBrand {
  return useContext(BrandContext);
}

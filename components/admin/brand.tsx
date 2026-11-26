"use client";

import { createContext, useContext } from "react";

/** 管理画面に出す会社名。ログイン前（会社が分からないとき）は null */
export type AdminBrand = { name: string; initials: string } | null;

const AdminBrandContext = createContext<AdminBrand>(null);

export function AdminBrandProvider({ brand, children }: { brand: AdminBrand; children: React.ReactNode }) {
  return <AdminBrandContext.Provider value={brand}>{children}</AdminBrandContext.Provider>;
}

export function useAdminBrand(): AdminBrand {
  return useContext(AdminBrandContext);
}

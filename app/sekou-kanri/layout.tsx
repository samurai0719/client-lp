import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "建設・設備求人データベース | 年収800万円以下の施工管理の方へ",
  description:
    "施工管理経験者の方へ。非公開求人を含む建設・設備専門の求人情報を無料で確認できます。転職するか迷っている方も、まずは求人を見てから判断できます。",
};

export default function SekouKanriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

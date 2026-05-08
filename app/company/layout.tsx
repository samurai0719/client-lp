import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "株式会社adofy（アドフィー）| Web制作・LP制作・Web集客支援",
  description:
    "ホームページ制作・LP制作・Web集客支援を一気通貫で対応。成果につながるWeb戦略を美しく設計します。岐阜県・全国対応。",
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

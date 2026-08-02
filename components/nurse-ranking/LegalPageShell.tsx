import type { ReactNode } from "react";
import Header from "@/components/nurse-ranking/Header";
import Footer from "@/components/nurse-ranking/Footer";

export default function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
        <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-slate-600 [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

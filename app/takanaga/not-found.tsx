import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
      <div className="text-center max-w-md">
        <p className="text-6xl font-black text-(--tkn-blue-light) mb-4 select-none">404</p>
        <h1 className="text-2xl font-bold text-(--tkn-navy-deep) mb-3">
          ページが見つかりません
        </h1>
        <p className="text-(--tkn-text-muted) text-base leading-relaxed mb-8">
          お探しのページは移動または削除された可能性があります。
        </p>
        <Link href="/" className="tkn-btn-primary">
          トップページへ
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </div>
  );
}

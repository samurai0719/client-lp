import Link from "next/link";
import { OPERATOR, PATHS, SERVICE, SHOW_NOTICE_NUMBER } from "@/config/driver-company";

/**
 * 企業向けページ共通の枠（ヘッダー＋フッター）。
 * LP・求人登録・メール認証・規約ページで同じ見た目にする。
 *
 * フッターの事業者情報は config/driver-company.ts に値が入っている項目だけを表示する。
 * 特定募集情報等提供事業の届出受理番号も、正式に受理されて値が入るまで行ごと出さない。
 */
export default function CompanyShell({
  children,
  /** 追従CTAの高さぶん、フッター下に余白を足すか */
  reserveStickySpace = false,
}: {
  children: React.ReactNode;
  reserveStickySpace?: boolean;
}) {
  return (
    <div className="bg-white text-[#0d2b52]">
      <header className="border-b border-[#0d2b52]/10 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-3 sm:px-6">
          <Link href={PATHS.lp} className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SERVICE.logo}
              alt={SERVICE.name}
              width={640}
              height={645}
              className="block h-9 w-auto"
            />
            <span className="min-w-0">
              <span className="block text-[13px] font-bold leading-tight text-[#0d2b52] sm:text-sm">
                ドライバー採用に特化した求人サービス
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-[#0d2b52]/45">
                FOR EMPLOYERS
              </span>
            </span>
          </Link>
          <Link
            href={PATHS.register}
            className="hidden shrink-0 rounded-full bg-[#ffc400] px-4 py-2 text-sm font-bold text-[#0d2b52] hover:bg-[#ffd233] sm:inline-block"
          >
            求人を無料登録
          </Link>
        </div>
      </header>

      {children}

      <footer
        className={`bg-[#0a2144] pt-12 text-white/70 ${
          reserveStickySpace ? "pb-28 md:pb-12" : "pb-12"
        }`}
      >
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-6">
          <div className="flex flex-col items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SERVICE.logo}
              alt={SERVICE.name}
              width={640}
              height={645}
              className="block h-10 w-auto rounded-lg bg-white p-1.5"
            />
            <p className="text-sm leading-relaxed">
              {SERVICE.name}は、ドライバー求人に特化した募集情報等提供サービスです。
              企業から提供された求人情報を求職者へ掲載・提供します。人材紹介サービスではありません。
            </p>
          </div>

          <dl className="mt-6 space-y-1.5 text-[13px] leading-relaxed">
            {OPERATOR.name && (
              <div className="flex gap-2">
                <dt className="shrink-0 text-white/50">事業者名</dt>
                <dd>{OPERATOR.name}</dd>
              </div>
            )}
            {OPERATOR.tradeName && (
              <div className="flex gap-2">
                <dt className="shrink-0 text-white/50">屋号</dt>
                <dd>{OPERATOR.tradeName}</dd>
              </div>
            )}
            {OPERATOR.address && (
              <div className="flex gap-2">
                <dt className="shrink-0 text-white/50">所在地</dt>
                <dd>{OPERATOR.address}</dd>
              </div>
            )}
            {OPERATOR.phone && (
              <div className="flex gap-2">
                <dt className="shrink-0 text-white/50">電話番号</dt>
                <dd>{OPERATOR.phone}</dd>
              </div>
            )}
            {OPERATOR.email && (
              <div className="flex gap-2">
                <dt className="shrink-0 text-white/50">メールアドレス</dt>
                <dd>{OPERATOR.email}</dd>
              </div>
            )}
            {/* 受理番号は正式受理後に値が入ったときだけ表示する */}
            {SHOW_NOTICE_NUMBER && (
              <div className="flex gap-2">
                <dt className="shrink-0 text-white/50">特定募集情報等提供事業届出受理番号</dt>
                <dd>{OPERATOR.noticeNumber}</dd>
              </div>
            )}
          </dl>

          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
            <Link href={PATHS.terms} className="underline underline-offset-2 hover:text-white">
              企業向け利用規約
            </Link>
            <Link href={PATHS.refundPolicy} className="underline underline-offset-2 hover:text-white">
              早期退職時返金規程
            </Link>
            <Link href={PATHS.privacy} className="underline underline-offset-2 hover:text-white">
              プライバシーポリシー
            </Link>
            <a href={SERVICE.jobSeekerUrl} className="underline underline-offset-2 hover:text-white">
              ドライバーとしてお仕事をお探しの方はこちら
            </a>
          </nav>

          <p className="mt-8 text-[12px] text-white/45">
            © 2026 {SERVICE.name} All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import Link from 'next/link';
import { OPERATOR } from '@/config/driver-company';

export type SeekerClause = { heading: string; body: (string | string[])[] };

/**
 * 求職者向けの規約ページ（/driver/terms・/driver/privacy）の共通レイアウト。
 * 求職者向けLPと同じ 520px の中央カード・青系の見た目にそろえる。
 * 事業者情報は config/driver-company.ts に値が入っている項目だけを出す（未確定の情報を出さない）。
 */
export default function SeekerLegalPage({
  title,
  lead,
  clauses,
  updatedAt,
}: {
  title: string;
  lead: string;
  clauses: SeekerClause[];
  updatedAt: string;
}) {
  const operator = [
    OPERATOR.name && ['運営者', OPERATOR.name],
    OPERATOR.address && ['所在地', OPERATOR.address],
    OPERATOR.email && ['お問い合わせ', OPERATOR.email],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-[520px] mx-auto bg-white min-h-screen shadow-[0_0_60px_rgba(30,64,175,0.08)]">
        <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
          <Link href="/driver" className="px-4 py-2.5 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/driver/logo.png" alt="ドラテク" width={640} height={645} className="h-11 w-auto block bg-white rounded-lg p-1.5 shadow-sm" />
            <span className="text-[13px] font-bold leading-tight">ドライバー求人・転職サービス</span>
          </Link>
        </header>

        <main className="px-5 py-8">
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{lead}</p>

          <div className="mt-7 space-y-7">
            {clauses.map((c, i) => (
              <section key={c.heading}>
                <h2 className="text-base font-bold text-slate-800">
                  第{i + 1}条（{c.heading}）
                </h2>
                <div className="mt-2 space-y-2">
                  {c.body.map((b, j) =>
                    Array.isArray(b) ? (
                      <ul key={j} className="space-y-1 pl-1">
                        {b.map((item) => (
                          <li key={item} className="flex gap-1.5 text-sm leading-relaxed text-slate-600">
                            <span aria-hidden="true" className="text-slate-400">・</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={j} className="text-sm leading-relaxed text-slate-600">{b}</p>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>

          {operator.length > 0 && (
            <dl className="mt-8 rounded-xl bg-slate-50 p-4 text-sm">
              {operator.map(([k, v]) => (
                <div key={k} className="flex gap-3 py-0.5">
                  <dt className="w-24 shrink-0 font-bold text-slate-500">{k}</dt>
                  <dd className="min-w-0 break-words text-slate-700">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-400">制定日：{updatedAt}</p>
        </main>

        <footer className="text-center py-8 text-xs text-slate-400 border-t border-slate-100">
          <p className="mb-2 flex justify-center gap-4">
            <a href="/driver/terms" className="hover:text-slate-600">利用規約</a>
            <a href="/driver/privacy" className="hover:text-slate-600">個人情報の取り扱い</a>
          </p>
          <p>© 2026 ドラテク All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

import CompanyShell from "./CompanyShell";

/**
 * 規約ページ共通のレイアウト。
 * 本文は条項の配列で渡す。LPに書いた料金・課金条件・返金率と矛盾しないよう、
 * 金額や返金率は config/driver-company.ts の値を参照して組み立てること。
 */
export interface Clause {
  heading: string;
  /** 段落。文字列は本文、配列は箇条書き */
  body: (string | string[])[];
}

export default function LegalPage({
  title,
  lead,
  clauses,
  updatedAt,
}: {
  title: string;
  lead?: string;
  clauses: Clause[];
  updatedAt: string;
}) {
  return (
    <CompanyShell>
      <main className="bg-[#f5f8fc] py-12 sm:py-16">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-6">
          <article className="rounded-2xl border border-[#0d2b52]/10 bg-white p-6 shadow-[0_10px_30px_rgba(13,43,82,0.06)] sm:p-10">
            <h1 className="text-2xl font-bold leading-relaxed text-[#0d2b52] sm:text-3xl">
              {title}
            </h1>
            {lead && (
              <p className="mt-4 text-[15px] leading-relaxed text-[#0d2b52]/75">{lead}</p>
            )}

            <div className="mt-8 space-y-8">
              {clauses.map((clause, i) => (
                <section key={clause.heading}>
                  <h2 className="text-lg font-bold leading-snug text-[#0d2b52]">
                    第{i + 1}条（{clause.heading}）
                  </h2>
                  <div className="mt-3 space-y-3">
                    {clause.body.map((block, j) =>
                      Array.isArray(block) ? (
                        <ul key={j} className="space-y-1.5 pl-1">
                          {block.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-[15px] leading-relaxed text-[#0d2b52]/80"
                            >
                              <span aria-hidden="true" className="mt-0.5 shrink-0 text-[#0d2b52]/40">
                                ・
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p key={j} className="text-[15px] leading-relaxed text-[#0d2b52]/80">
                          {block}
                        </p>
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-10 border-t border-[#0d2b52]/10 pt-4 text-[13px] text-[#0d2b52]/55">
              制定日：{updatedAt}
            </p>
          </article>
        </div>
      </main>
    </CompanyShell>
  );
}

import { CTA_HREF, LEGAL, OPERATOR, SITE } from "./config";
import LegalOpener from "./LegalOpener";

/** フッター。運営者情報・会社概要・規約類はページ遷移させず、その場で開閉して読めるようにする */
export default function Footer() {
  return (
    <footer className="sr-footer">
      <LegalOpener />
      <div className="sr-container">
        <p className="sr-footer__brand">
          採用<em>レスキュー</em>
        </p>
        <p className="sr-footer__catch">{SITE.catch}</p>
        <p className="sr-footer__op">
          運営：
          <a href={OPERATOR.siteUrl} target="_blank" rel="noopener">
            {OPERATOR.name}
          </a>
          （代表 {OPERATOR.representative}）
        </p>

        <nav className="sr-footer__nav" aria-label="フッター">
          {/* 並び：運営者情報 / 会社概要 / お問い合わせ / プライバシーポリシー / 特定商取引法 */}
          {LEGAL.slice(0, 2).map((l) => (
            <a key={l.id} href={`#legal-${l.id}`}>
              {l.title}
            </a>
          ))}
          <a href={CTA_HREF}>お問い合わせ</a>
          {LEGAL.slice(2).map((l) => (
            <a key={l.id} href={`#legal-${l.id}`}>
              {l.title}
            </a>
          ))}
        </nav>

        <div className="sr-footer__legal">
          {LEGAL.map((l) => (
            <details key={l.id} id={`legal-${l.id}`} className="sr-legal">
              <summary>{l.title}</summary>
              <dl>
                {l.items.map((it) => (
                  <div key={it.term}>
                    <dt>{it.term}</dt>
                    <dd>
                      {it.href ? (
                        <a href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noopener">
                          {it.desc}
                        </a>
                      ) : (
                        it.desc
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </div>

        <p className="sr-footer__copy">© {new Date().getFullYear()} {OPERATOR.name}（{SITE.name}） All Rights Reserved.</p>
      </div>
    </footer>
  );
}

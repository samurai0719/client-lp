import { CtaButton } from "./ui";
import { SITE } from "./config";

/**
 * ヘッダー。広告流入LPのため、離脱につながるナビゲーションは置かず
 * ロゴとCTAだけにしている（スマホのFV内でもCTAが必ず見える）。
 */
export default function Header() {
  return (
    <header className="sr-header">
      <div className="sr-header__inner">
        <span className="sr-logo" aria-label={SITE.name}>
          <span className="sr-logo__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="100%" height="100%">
              <path d="M12 2 3.5 5.5v6c0 5.4 3.6 9.6 8.5 10.5 4.9-.9 8.5-5.1 8.5-10.5v-6L12 2Z" fill="currentColor" />
              <path d="M10.4 7.5h3.2v3h3v3.2h-3v3h-3.2v-3h-3v-3.2h3v-3Z" fill="#fff" />
            </svg>
          </span>
          <span className="sr-logo__text">
            採用<em>レスキュー</em>
          </span>
        </span>
        <CtaButton size="sm" location="header" />
      </div>
    </header>
  );
}

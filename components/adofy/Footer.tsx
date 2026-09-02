"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { SITE } from "./config";
import { LogoMark } from "./ui";

/* ═══════════════════════════════════════════════════════════════════════════
   ▼▼▼ 運営者情報 / プライバシーポリシー / 特定商取引法に基づく表記 差し替え箇所 ▼▼▼
   内容が確定したら、下の LEGAL の各 items に項目を追加するだけで反映される。
   （確定前に仮の内容を掲載しないよう、現時点では項目名と「準備中」だけを出す）

   将来ページとして独立させる場合は、app/adofy/privacy/page.tsx 等を作り、
   下の LEGAL の該当エントリを { href: "/adofy/privacy" } に置き換えればよい。
   ═══════════════════════════════════════════════════════════════════════════ */
type LegalDoc = {
  id: string;
  title: string;
  items: { term: string; desc: string }[];
};

const PREPARING = "内容が確定次第、掲載します。お急ぎの場合は無料相談時にお伝えください。";

const LEGAL: LegalDoc[] = [
  {
    id: "operator",
    title: "運営者情報",
    items: [
      { term: "サービス名", desc: "adofy（建設業専門の集客ホームページ制作）" },
      { term: "運営者", desc: PREPARING },
      { term: "所在地", desc: PREPARING },
      { term: "連絡先", desc: PREPARING },
      { term: "事業内容", desc: "ホームページ制作、ランディングページ制作、Web広告運用、集客支援" },
    ],
  },
  {
    id: "privacy",
    title: "プライバシーポリシー",
    items: [
      { term: "個人情報の取得", desc: PREPARING },
      { term: "利用目的", desc: PREPARING },
      { term: "第三者提供", desc: PREPARING },
      { term: "アクセス解析", desc: PREPARING },
      { term: "お問い合わせ窓口", desc: PREPARING },
    ],
  },
  {
    id: "tokushoho",
    title: "特定商取引法に基づく表記",
    items: [
      { term: "販売事業者", desc: PREPARING },
      { term: "運営統括責任者", desc: PREPARING },
      { term: "所在地・連絡先", desc: PREPARING },
      { term: "販売価格", desc: "各プランの記載金額（税込・税別の表記は確定後に掲載します）" },
      { term: "代金の支払時期・方法", desc: PREPARING },
      { term: "役務の提供時期", desc: PREPARING },
      { term: "キャンセル・返金", desc: PREPARING },
    ],
  },
];

const PAGE_LINKS = [
  { href: "#solution", label: "サービス内容" },
  { href: "#pricing", label: "料金プラン" },
  { href: "#flow", label: "制作の流れ" },
  { href: "#faq", label: "よくある質問" },
];

export default function Footer() {
  const [openDoc, setOpenDoc] = useState<LegalDoc | null>(null);

  // 相談フォームなど他ページから /adofy#privacy のリンクで開けるようにする
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace("#", "");
      const doc = LEGAL.find((d) => d.id === id);
      if (doc) setOpenDoc(doc);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <footer className="adf-footer">
      <div className="adf-container">
        <div className="adf-footer__top">
          <div>
            <span className="adf-logo">
              <LogoMark className="adf-logo__mark" />
              <span className="adf-logo__text">
                adof<b>y</b>
              </span>
            </span>
            <p className="adf-footer__desc">{SITE.description}</p>
          </div>

          <nav aria-label="サイト内リンク">
            <h3>Menu</h3>
            <ul>
              {PAGE_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3>Information</h3>
            <ul>
              {LEGAL.map((doc) => (
                <li key={doc.id}>
                  <button
                    type="button"
                    className="adf-linklike"
                    onClick={() => setOpenDoc(doc)}
                  >
                    {doc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="adf-footer__bottom">
          <small>Copyright © adofy</small>
          <small>建設業専門の集客ホームページ制作</small>
        </div>
      </div>

      <LegalModal doc={openDoc} onClose={() => setOpenDoc(null)} />
    </footer>
  );
}

/** ネイティブ <dialog> を使い、Escでの閉じる・フォーカス管理をブラウザに任せる */
function LegalModal({ doc, onClose }: { doc: LegalDoc | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (doc && !el.open) el.showModal();
    if (!doc && el.open) el.close();
  }, [doc]);

  // 背景クリックで閉じる
  const onBackdropClick = useCallback(
    (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === ref.current) onClose();
    },
    [onClose]
  );

  return (
    <dialog
      ref={ref}
      className="adf-modal"
      onClose={onClose}
      onClick={onBackdropClick}
      aria-labelledby="adf-modal-title"
    >
      {doc ? (
        <>
          <div className="adf-modal__head">
            <h2 id="adf-modal-title">{doc.title}</h2>
            <button
              type="button"
              className="adf-modal__close"
              onClick={onClose}
              aria-label="閉じる"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="adf-modal__body">
            <dl>
              {doc.items.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>{item.desc}</dd>
                </div>
              ))}
            </dl>
            <p className="adf-modal__note">
              こちらの内容は準備中の項目を含みます。ご契約前に、確定した内容を書面でご案内します。
            </p>
          </div>
        </>
      ) : null}
    </dialog>
  );
}

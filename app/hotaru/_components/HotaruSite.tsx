import Image from "next/image";
import {
  formatAddress,
  hotaruConfig as c,
  hoursRows,
  mapSearchUrl,
  visibleFacilities,
} from "@/config/hotaru";
import Header, { MapIcon, PhoneIcon } from "./Header";
import Logo from "./Logo";
import Reveal from "./Reveal";

const tel = `tel:${c.contact.phoneTel}`;
const mapUrl = mapSearchUrl();
const address = formatAddress();

/** 句ごとに折り返す見出し（語の途中で改行させない） */
function Phrases({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((line) => (
        <span key={line} className="inline-block">
          {line}
        </span>
      ))}
    </>
  );
}

function ImageNote({ className = "" }: { className?: string }) {
  if (!c.images.isImageOnly) return null;
  return <span className={`ht-image-note ${className}`}>{c.images.imageNote}</span>;
}

function SectionLabel({ children, tone }: { children: React.ReactNode; tone: "dark" | "light" }) {
  return (
    <p className="ht-label" data-tone={tone}>
      {children}
    </p>
  );
}

/** 蛍の光を思わせる小さな点（装飾のみ） */
function Fireflies({ variant }: { variant: "hero" | "contact" }) {
  return (
    <span className="ht-fireflies" data-variant={variant} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function HotaruSite() {
  const facilities = visibleFacilities();
  const hours = hoursRows();

  return (
    <>
      <Reveal />
      <Header />

      <main id="main">
        {/* ── ファーストビュー ───────────────────────── */}
        <section id="top" aria-labelledby="ht-hero-title" className="ht-hero ht-dark">
          <div className="ht-hero__media">
            <Image
              src={c.images.hero.src}
              alt={c.images.hero.alt}
              fill
              preload
              sizes="100vw"
              className="ht-hero__img"
            />
            <ImageNote className="ht-hero__note" />
          </div>

          <div className="ht-hero__body">
            <div className="ht-container">
              <div className="ht-hero__text">
                <Fireflies variant="hero" />
                <p className="ht-hero__eyebrow">{c.copy.hero.eyebrow}</p>
                <p className="ht-hero__catch ht-mincho">
                  {c.copy.hero.catchLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <h1 id="ht-hero-title" className="ht-hero__name ht-mincho">
                  {c.shop.name}
                </h1>
                <p className="ht-hero__sub">{c.copy.hero.sub}</p>
                <div className="ht-hero__cta">
                  <a href={tel} className="ht-btn ht-btn--primary ht-focus-dark">
                    <PhoneIcon />
                    電話で問い合わせる
                  </a>
                  <a href="#access" className="ht-btn ht-btn--ghost-dark ht-focus-dark">
                    アクセスを見る
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 蛍について ───────────────────────────── */}
        <section id="about" aria-labelledby="ht-about-title" className="ht-light ht-section">
          <div className="ht-container">
            <div className="ht-about ht-reveal">
              <div className="ht-about__side">
                <SectionLabel tone="light">{c.copy.about.label}</SectionLabel>
                <span className="ht-about__rule" aria-hidden="true" />
              </div>
              <div className="ht-about__main">
                <h2 id="ht-about-title" className="ht-h2 ht-mincho">
                  <Phrases lines={c.copy.about.heading} />
                </h2>
                <div className="ht-about__body">
                  {c.copy.about.body.map((p) => (
                    <p key={p.join("")}>
                      <Phrases lines={p} />
                    </p>
                  ))}
                </div>
                <dl className="ht-about__facts">
                  <div>
                    <dt>所在地</dt>
                    <dd>
                      {c.address.locality}
                      {c.address.street.replace(/\d.*$/, "")}
                    </dd>
                  </div>
                  <div>
                    <dt>最寄り駅</dt>
                    <dd>{c.access.nearestStation}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ── 料理とお酒 ───────────────────────────── */}
        <section id="menu" aria-labelledby="ht-menu-title" className="ht-dark ht-section">
          <div className="ht-container">
            <header className="ht-menu__head ht-reveal">
              <SectionLabel tone="dark">{c.copy.menu.label}</SectionLabel>
              <h2 id="ht-menu-title" className="ht-h2 ht-mincho">
                <Phrases lines={c.copy.menu.heading} />
              </h2>
            </header>

            <div className="ht-feature ht-feature--dishes">
              <figure className="ht-feature__figure ht-reveal">
                <Image
                  src={c.images.dishes.src}
                  alt={c.images.dishes.alt}
                  width={c.images.dishes.width}
                  height={c.images.dishes.height}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="ht-feature__img"
                />
                <figcaption>
                  <ImageNote />
                </figcaption>
              </figure>
              <div className="ht-feature__text ht-reveal">
                <span className="ht-feature__num" aria-hidden="true">
                  一皿
                </span>
                <h3 className="ht-h3 ht-mincho">
                  <Phrases lines={c.copy.menu.dishes.heading} />
                </h3>
                <p>{c.copy.menu.dishes.body}</p>
              </div>
            </div>

            <div className="ht-feature ht-feature--drinks">
              <figure className="ht-feature__figure ht-reveal">
                <Image
                  src={c.images.drinks.src}
                  alt={c.images.drinks.alt}
                  width={c.images.drinks.width}
                  height={c.images.drinks.height}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="ht-feature__img"
                />
                <figcaption>
                  <ImageNote />
                </figcaption>
              </figure>
              <div className="ht-feature__text ht-reveal">
                <span className="ht-feature__num" aria-hidden="true">
                  一杯
                </span>
                <h3 className="ht-h3 ht-mincho">
                  <Phrases lines={c.copy.menu.drinks.heading} />
                </h3>
                <p>{c.copy.menu.drinks.body}</p>
              </div>
            </div>

            <p className="ht-menu__notice ht-reveal">
              <Phrases lines={c.copy.menu.notice} />
            </p>
          </div>
        </section>

        {/* ── 店舗情報・アクセス ───────────────────────── */}
        <section id="access" aria-labelledby="ht-access-title" className="ht-light ht-section">
          <div className="ht-container">
            <div className="ht-access ht-reveal">
              <div className="ht-access__head">
                <SectionLabel tone="light">{c.copy.access.label}</SectionLabel>
                <h2 id="ht-access-title" className="ht-h2 ht-mincho">
                  <Phrases lines={c.copy.access.heading} />
                </h2>
                <div className="ht-access__logo" aria-hidden="true">
                  <Logo tone="dark" size="lg" />
                </div>
              </div>

              <div className="ht-access__info">
                <dl className="ht-table">
                  <div>
                    <dt>店名</dt>
                    <dd>{c.shop.name}</dd>
                  </div>
                  <div>
                    <dt>住所</dt>
                    <dd>{address}</dd>
                  </div>
                  <div>
                    <dt>電話</dt>
                    <dd>
                      <a href={tel} className="ht-textlink ht-focus-light">
                        {c.contact.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>アクセス</dt>
                    <dd>{c.access.nearestStation}</dd>
                  </div>
                  {hours.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                  {facilities.map((f) => (
                    <div key={f.label}>
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="ht-access__actions">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ht-btn ht-btn--dark ht-focus-light"
                  >
                    <MapIcon />
                    {c.copy.access.mapButton}
                    <span className="sr-only">（Googleマップが新しいタブで開きます）</span>
                  </a>
                  <a href={tel} className="ht-btn ht-btn--outline-light ht-focus-light">
                    <PhoneIcon />
                    電話で問い合わせる
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── お問い合わせ ─────────────────────────── */}
        <section
          id="contact"
          aria-labelledby="ht-contact-title"
          className="ht-dark ht-section ht-contact"
        >
          <Fireflies variant="contact" />
          <div className="ht-container">
            <div className="ht-contact__inner ht-reveal">
              <SectionLabel tone="dark">{c.copy.contact.label}</SectionLabel>
              <h2 id="ht-contact-title" className="ht-h2 ht-mincho">
                <Phrases lines={c.copy.contact.heading} />
              </h2>
              <a
                href={tel}
                className="ht-contact__number ht-mincho ht-focus-dark"
                aria-label={`電話番号 ${c.contact.phoneDisplay}`}
              >
                {c.contact.phoneDisplay}
              </a>
              <a href={tel} className="ht-btn ht-btn--primary ht-btn--lg ht-focus-dark">
                <PhoneIcon className="size-5" />
                {c.copy.contact.button}
              </a>
              <p className="ht-contact__note">
                <Phrases lines={c.copy.contact.note} />
              </p>
              <p className="ht-contact__note">
                <Phrases lines={c.hours.unverifiedLongText} />
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── フッター ───────────────────────────────── */}
      <footer className="ht-footer">
        <div className="ht-container ht-footer__inner">
          <div className="ht-footer__shop">
            <Logo tone="dark" />
            <address className="not-italic">
              <p>{address}</p>
              <p>
                TEL{" "}
                <a href={tel} className="ht-textlink ht-focus-light">
                  {c.contact.phoneDisplay}
                </a>
              </p>
            </address>
          </div>
          <a href="#top" className="ht-pagetop ht-focus-light">
            <span aria-hidden="true" className="ht-pagetop__arrow" />
            ページトップへ
          </a>
        </div>
      </footer>

      {/* ── スマホ固定CTA ──────────────────────────── */}
      <nav aria-label="お問い合わせ・地図" className="ht-sticky-cta md:hidden">
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ht-sticky-cta__btn ht-sticky-cta__btn--map ht-focus-dark"
        >
          <MapIcon />
          地図を見る
          <span className="sr-only">（Googleマップが新しいタブで開きます）</span>
        </a>
        <a href={tel} className="ht-sticky-cta__btn ht-sticky-cta__btn--tel ht-focus-dark">
          <PhoneIcon />
          電話する
        </a>
      </nav>
    </>
  );
}

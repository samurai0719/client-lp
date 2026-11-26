"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2 } from "lucide-react";

/**
 * 縦型の動画広告カード。最初は6秒の無音ループを画面に入ったときだけ流し、
 * タップすると本編（音声あり・操作バー付き）に切り替えて再生する。
 */
export default function WorkVideoCard({ slug, id, title, index }: { slug: string; id: string; title: string; index: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || full) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [full]);

  const playFull = () => {
    const v = ref.current;
    if (!v) return;
    setFull(true);
    v.src = `/videos/works/${slug}/${id}.mp4`;
    v.muted = false;
    v.loop = false;
    v.controls = true;
    v.play().catch(() => {});
  };

  return (
    <figure className="wk-video">
      <div className="wk-video__phone">
        <video
          ref={ref}
          src={`/videos/works/${slug}/${id}-loop.mp4`}
          poster={`/images/works/${slug}/posters/${id}.jpg`}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${title}の動画広告`}
        />
        {!full && (
          <button type="button" className="wk-video__play" onClick={playFull} aria-label={`${title}を音声ありで再生する`}>
            <span className="wk-video__btn">
              <Play aria-hidden="true" />
            </span>
            <span className="wk-video__sound">
              <Volume2 aria-hidden="true" />
              音声ありで見る
            </span>
          </button>
        )}
      </div>
      <figcaption>
        <span lang="en">{String(index + 1).padStart(2, "0")}</span>
        {title}
      </figcaption>
    </figure>
  );
}

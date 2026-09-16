import { hotaruConfig as c } from "@/config/hotaru";

type Props = {
  tone?: "light" | "dark";
  size?: "sm" | "lg";
};

/** 「蛍」を主役にしたテキストロゴ（提案デザイン） */
export default function Logo({ tone = "light", size = "sm" }: Props) {
  return (
    <span
      className="ht-logo"
      data-tone={tone}
      data-size={size}
      role="img"
      aria-label={c.shop.name}
    >
      <span className="ht-logo__sub" aria-hidden="true">
        {c.shop.logoSub}
      </span>
      <span className="ht-logo__main" aria-hidden="true">
        {c.shop.logoMain}
        <span className="ht-logo__glow" />
      </span>
    </span>
  );
}

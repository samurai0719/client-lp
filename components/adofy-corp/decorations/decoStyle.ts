import type { CSSProperties } from "react";

/**
 * Inline style only ever sets `color` when a real value is passed.
 * `style={{ color: "currentColor" }}` would set the element's own
 * `color` to `currentColor`, which resolves to `inherit` and — being
 * inline — overrides any `text-*` className that should be the
 * actual source of truth for hue.
 */
export function decoStyle(color: string, opacity?: number): CSSProperties {
  const style: CSSProperties = {};
  if (opacity !== undefined) style.opacity = opacity;
  if (color !== "currentColor") style.color = color;
  return style;
}

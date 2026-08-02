import fs from "node:fs";
import path from "node:path";

// public/ 配下の画像がまだ配置されていない場合に、next/image の壊れた画像表示ではなく
// レイアウトの崩れないプレースホルダーを出すためのサーバー側チェック。
// サーバーコンポーネントでのみ使用可能（"use client" コンポーネントでは使わないこと）。
export function publicImageExists(relativePath: string): boolean {
  if (!relativePath) return false;
  try {
    const filePath = path.join(process.cwd(), "public", relativePath.replace(/^\//, ""));
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

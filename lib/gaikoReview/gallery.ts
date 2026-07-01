import { readdirSync } from "node:fs";
import path from "node:path";

const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gaiko-review", "gallery");
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

export type GalleryImage = {
  src: string;
  fileName: string;
};

// public/images/gaiko-review/gallery に実在する画像だけを返す。
// 画像がまだ配置されていない場合は空配列（ダミー画像は表示しない）。
export function getGalleryImages(): GalleryImage[] {
  try {
    const files = readdirSync(GALLERY_DIR);
    return files
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => ({
        src: `/images/gaiko-review/gallery/${file}`,
        fileName: file,
      }));
  } catch {
    return [];
  }
}

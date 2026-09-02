import fs from "fs";
import path from "path";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

/**
 * Looks for `<publicDir>/<baseName>.{jpg,jpeg,png,webp}` and returns the
 * public URL of the first one that exists, or null if none do. Used by
 * server components to fall back gracefully to a placeholder when an
 * editor hasn't dropped a real photo in yet.
 */
export function resolveLocalImage(publicDir: string, baseName: string): string | null {
  for (const ext of EXTENSIONS) {
    const filePath = path.join(process.cwd(), "public", publicDir, `${baseName}.${ext}`);
    if (fs.existsSync(filePath)) {
      return `/${publicDir}/${baseName}.${ext}`;
    }
  }
  return null;
}

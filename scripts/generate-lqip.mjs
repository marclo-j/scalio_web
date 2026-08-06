// Generates LQIP (Low Quality Image Placeholder) 10x10px webp versions for
// each poster in /public/videos/. Output written next to the originals with a
// "-lqip" suffix. Run via `pnpm run lqip` or as part of `prebuild`.
import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, basename, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const VIDEOS_DIR = join(PUBLIC, "videos");

const manifest = {};

async function processPoster(filePath) {
  const name = basename(filePath, extname(filePath));
  if (name.endsWith("-lqip")) return;
  if (!/^.*-poster\.(webp|jpg|jpeg|png)$/i.test(filePath)) return;

  const src = join(VIDEOS_DIR, filePath);
  const lqipName = `${name}-lqip.webp`;
  const lqipPath = join(VIDEOS_DIR, lqipName);

  const { data, info } = await sharp(src)
    .resize(10, 10, { fit: "cover" })
    .webp({ quality: 40 })
    .toBuffer({ resolveWithObject: true });

  await writeFile(lqipPath, data);

  // Encode as data URI for inline LQIP (≈200 bytes each).
  const dataUri = `data:image/webp;base64,${data.toString("base64")}`;
  manifest[`/videos/${filePath}`] = {
    lqipPath: `/videos/${lqipName}`,
    lqipDataUri: dataUri,
    width: info.width,
    height: info.height,
  };
  console.log(`  ✓ ${filePath} → ${lqipName} (${data.length} bytes)`);
}

async function main() {
  if (!existsSync(VIDEOS_DIR)) {
    console.warn("No /public/videos directory; skipping LQIP.");
    return;
  }
  const files = await readdir(VIDEOS_DIR);
  for (const f of files) {
    if (/\.(webp|jpg|jpeg|png)$/i.test(f)) {
      await processPoster(f).catch((e) =>
        console.error(`  ✗ ${f}:`, e.message)
      );
    }
  }
  const outPath = join(ROOT, "src", "data", "lqip.json");
  await writeFile(outPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written: src/data/lqip.json (${Object.keys(manifest).length} entries)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

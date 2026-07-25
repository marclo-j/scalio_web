import sharp from "sharp";
import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

async function optimize() {
  console.log("Optimizing images...\n");

  // 1. scalio-logo.webp: 2000x2000 -> 160x160 (hero: 40px CSS, footer: 80px CSS, 2x = 160)
  const logoBuf = await readFile(join(publicDir, "scalio-logo.webp"));
  const logoOpt = await sharp(logoBuf)
    .resize(160, 160, { fit: "cover" })
    .webp({ quality: 85 })
    .toBuffer();
  await writeFile(join(publicDir, "scalio-logo.webp"), logoOpt);
  console.log(`  scalio-logo.webp: ${(logoBuf.length / 1024).toFixed(1)}KB -> ${(logoOpt.length / 1024).toFixed(1)}KB`);

  // 2. Service images - displayed at ~1680x1120, source at 1700x1280. Generate responsive sizes.
  //    Web display max ~1120px wide, retina 2x = 2240. But original is only 1700. Keep at 1680 width.
  for (const name of ["web.avif", "ia.avif", "procesos.avif"]) {
    const path = join(publicDir, "images", name);
    const buf = await readFile(path);
    const meta = await sharp(buf).metadata();
    // downscale to max 1280 width (display is 707-1120px, 2x = 2240, but we cap at 1280 for quality/size balance)
    const targetWidth = Math.min(meta.width, 1280);
    const opt = await sharp(buf)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .avif({ quality: 60, effort: 4 })
      .toBuffer();
    await writeFile(path, opt);
    console.log(`  images/${name}: ${(buf.length / 1024).toFixed(1)}KB (${meta.width}x${meta.height}) -> ${(opt.length / 1024).toFixed(1)}KB (${targetWidth}w)`);
  }

  // 3. Project thumbnails (codesotec.webp is the LCP!). Displayed at ~994x559 (1x) / ~1680x945 (mobile 1x).
  //    Lighthouse tested on mobile (moto g power) so display ~1680px wide on mobile but device is 412px CSS -> 824px 2x.
  //    Generate a smaller responsive version.
  //    Original: codesotec 157KB (probably 1920x1080), displayed at max ~1129px wide.
  //    Target: 1280px wide for retina, but keep quality good.
  for (const name of ["codesotec.webp", "ong-gotas-de-esperanza.webp"]) {
    const path = join(publicDir, "images", "projects", name);
    const buf = await readFile(path);
    const meta = await sharp(buf).metadata();
    // Cap at 1280px wide (display max ~1129px, 2x would be 2258 but we balance size)
    const targetWidth = Math.min(meta.width, 1280);
    const opt = await sharp(buf)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();
    await writeFile(path, opt);
    console.log(`  images/projects/${name}: ${(buf.length / 1024).toFixed(1)}KB (${meta.width}x${meta.height}) -> ${(opt.length / 1024).toFixed(1)}KB (${targetWidth}w)`);
  }

  // 4. Video posters - displayed at 166x626 CSS (mobile portrait video card).
  //    Source is 509x1920. Target: 332x1240 (2x of 166x620). But portrait, so resize to fit.
  //    Actually the video element is 166x626 CSS on mobile. 2x = 332x1252. Let's target width 340.
  for (const name of ["accesible-poster.webp", "velocidad-poster.webp", "tecnologia-poster.webp", "resultados-poster.webp"]) {
    const path = join(publicDir, "videos", name);
    const buf = await readFile(path);
    const meta = await sharp(buf).metadata();
    // portrait poster: 509x1920. Display: 166x626. 2x = 332x1252. Resize to width 340 keeping aspect.
    const targetWidth = Math.min(meta.width, 340);
    const opt = await sharp(buf)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();
    await writeFile(path, opt);
    console.log(`  videos/${name}: ${(buf.length / 1024).toFixed(1)}KB (${meta.width}x${meta.height}) -> ${(opt.length / 1024).toFixed(1)}KB (${targetWidth}w)`);
  }

  console.log("\nDone!");
}

optimize().catch((e) => {
  console.error(e);
  process.exit(1);
});

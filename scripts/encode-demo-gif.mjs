import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { GIFEncoder, quantize, applyPalette } = require("gifenc");
const { PNG } = require("pngjs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const frameDir = path.join(rootDir, "tmp", "linkedin-demo-frames");
const outputPath = path.join(rootDir, "linkedin-demo.gif");

if (!fs.existsSync(frameDir)) {
  throw new Error(`Frame directory not found: ${frameDir}`);
}

const frameFiles = fs
  .readdirSync(frameDir)
  .filter((file) => file.endsWith(".png"))
  .sort();

if (frameFiles.length === 0) {
  throw new Error(`No PNG frames found in ${frameDir}`);
}

const firstFrame = PNG.sync.read(fs.readFileSync(path.join(frameDir, frameFiles[0])));
const width = firstFrame.width;
const height = firstFrame.height;
const gif = GIFEncoder({ auto: true });
const delay = 550;

for (const [index, file] of frameFiles.entries()) {
  const png = PNG.sync.read(fs.readFileSync(path.join(frameDir, file)));
  if (png.width !== width || png.height !== height) {
    throw new Error(`Frame size mismatch in ${file}`);
  }

  const palette = quantize(png.data, 256, { format: "rgb565" });
  const indexed = applyPalette(png.data, palette, "rgb565");
  gif.writeFrame(indexed, width, height, {
    palette,
    delay,
    repeat: index === 0 ? 0 : undefined,
  });
}

gif.finish();
fs.writeFileSync(outputPath, Buffer.from(gif.bytes()));
console.log(`Wrote ${outputPath}`);

fs.rmSync(frameDir, { recursive: true, force: true });

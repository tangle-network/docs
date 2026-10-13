import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Run with the repository's locked dependencies: yarn node scripts/generate-social-previews.mjs
// Pass --check to verify committed PNGs without writing them. No network access is needed.
// The knot is copied from the canonical Tangle brand component, with provenance in the SVG.
// The Logo component pairs that knot with a bold "Tangle" wordmark. Use the docs' checked-in
// BreezeSans fonts instead of whichever fonts happen to be installed on this machine.
const root = new URL("../", import.meta.url);
const asset = (path) => new URL(path, root);
const width = 1200;
const height = 630;
const check = process.argv.includes("--check");
const cards = [
  ["default", "Tangle Docs", "AI agent infrastructure, documented"],
  [
    "integrations-hub",
    "Integration Hub",
    "Connect the tools your business uses",
  ],
  ["cloudbeds", "Connect Cloudbeds", "Property data, housekeeping, and folios"],
  [
    "pricelabs",
    "Connect PriceLabs",
    "Pricing data, costs, and setup requirements",
  ],
  ["deepgram", "Connect Deepgram", "Voice notes for staff and vendors"],
  [
    "whatsapp",
    "WhatsApp business line",
    "Choose a number and verify your phone",
  ],
];
const escape = (text) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

async function label(text, size, bold, color) {
  return sharp({
    text: {
      text: `<span foreground="${color}">${escape(text)}</span>`,
      font: `BreezeSans ${bold ? "Bold" : "Regular"} ${size}`,
      fontfile: fileURLToPath(
        asset(`public/fonts/BreezeSans-${bold ? "Bold" : "Regular"}.ttf`),
      ),
      dpi: 72,
      rgba: true,
    },
  })
    .png()
    .toBuffer();
}

const background =
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs><linearGradient id="background" x2="1" y2="1">
    <stop stop-color="#11101c"/><stop offset="1" stop-color="#171329"/>
  </linearGradient><linearGradient id="accent"><stop stop-color="#8e59ff"/>
    <stop offset="1" stop-color="#6888f9"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#background)"/>
  <rect width="8" height="630" fill="url(#accent)"/>
  <rect x="64" y="494" width="84" height="4" rx="2" fill="url(#accent)"/>
</svg>`);
const knot = await sharp(
  await readFile(asset("scripts/assets/tangle-knot.svg")),
)
  .resize(70, 70, { fit: "contain", background: "#00000000" })
  .png()
  .toBuffer();
const wordmark = await label("Tangle", 48, true, "#ffffff");
const footer = await label("docs.tangle.tools", 25, false, "#a4a0bd");

for (const [name, title, subtitle] of cards) {
  const titleImage = await label(title, 74, true, "#ffffff");
  const subtitleImage = await label(subtitle, 31, false, "#c8c4da");
  for (const textImage of [titleImage, subtitleImage]) {
    const metadata = await sharp(textImage).metadata();
    if (metadata.width > width - 128)
      throw new Error(`${name}: text exceeds the card's safe width`);
  }
  const png = await sharp(background)
    .composite([
      { input: knot, left: 60, top: 58 },
      { input: wordmark, left: 148, top: 70 },
      { input: titleImage, left: 64, top: 286 },
      { input: subtitleImage, left: 66, top: 400 },
      { input: footer, left: 66, top: 532 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
  const output = asset(`public/images/og/${name}.png`);
  if (check) {
    if (!png.equals(await readFile(output)))
      throw new Error(`${name}.png is out of date`);
  } else {
    await writeFile(output, png);
  }
  console.log(
    `${check ? "Verified" : "Generated"} ${name}.png (${width} x ${height})`,
  );
}

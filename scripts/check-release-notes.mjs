import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const releaseRoot = path.join(repoRoot, "pages/release-notes");

const productLines = {
  "blueprint-agent": {
    label: "Blueprint Agent",
    notePattern: /^\d{4}-\d{2}-\d{2}\.mdx$/,
    requiredSections: [
      "## Customer Impact",
      "## What Changed",
      "## Related Links",
    ],
  },
  sandbox: {
    label: "Sandbox",
    notePattern: /^\d{4}-\d{2}-\d{2}\.mdx$/,
    requiredSections: [
      "## Customer Impact",
      "## What Changed",
      "## Related Links",
    ],
  },
  router: {
    label: "Router",
    notePattern: /^\d{4}-\d{2}-\d{2}\.mdx$/,
    requiredSections: [
      "## Customer Impact",
      "## What Changed",
      "## Related Links",
    ],
  },
  "browser-agent": {
    label: "Browser Agent",
    notePattern: /^\d{4}-\d{2}-\d{2}\.mdx$/,
    requiredSections: [
      "## Customer Impact",
      "## What Changed",
      "## Related Links",
    ],
  },
  "audit-agent": {
    label: "Audit Agent",
    notePattern: /^\d{4}-\d{2}-\d{2}\.mdx$/,
    requiredSections: [
      "## Customer Impact",
      "## What Changed",
      "## Related Links",
    ],
  },
  "tnt-core": {
    label: "tnt-core",
    notePattern: /^\d+\.\d+\.\d+\.mdx$/,
    requiredSections: [
      "## Breaking Changes",
      "## Migration Checklist",
      "## Reference",
    ],
  },
};

const allowedBridgeDirs = new Set(["protocol"]);
const allowedRootFiles = new Set([
  "index.mdx",
  "all.mdx",
  "2026-06-29-product-surfaces.mdx",
]);

const forbiddenPublicCopy = [
  /\bProtocol and SDKs\b/i,
  /\bTangle Protocol and SDKs\b/i,
  /\bVanta\b/i,
  /\bA-LIGN\b/i,
  /\bauditors?\b/i,
  /\bevidence package\b/i,
  /\bsampling request\b/i,
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function readFile(targetPath) {
  if (!fs.existsSync(targetPath)) {
    fail(`Missing required file: ${path.relative(repoRoot, targetPath)}`);
    return "";
  }

  return fs.readFileSync(targetPath, "utf8");
}

function assertIncludes(content, needle, label) {
  if (!content.includes(needle)) {
    fail(`${label} is missing: ${needle}`);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasMetaKey(content, key) {
  return new RegExp(`(^|[\\s,{])["']?${escapeRegExp(key)}["']?\\s*:`).test(
    content,
  );
}

function hasFrontmatterField(content, field) {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);

  return Boolean(frontmatter?.[1].match(new RegExp(`^${field}:\\s*.+$`, "m")));
}

function routeForNote(slug, filename) {
  return `/release-notes/${slug}/${filename.replace(/\.mdx$/, "")}`;
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return listFiles(target);
    }

    return target;
  });
}

const rootMeta = readFile(path.join(releaseRoot, "_meta.ts"));
const allReleases = readFile(path.join(releaseRoot, "all.mdx"));

for (const [slug, config] of Object.entries(productLines)) {
  const productDir = path.join(releaseRoot, slug);
  const productMetaPath = path.join(productDir, "_meta.ts");
  const productIndexPath = path.join(productDir, "index.mdx");
  const productMeta = readFile(productMetaPath);
  const productIndex = readFile(productIndexPath);

  if (!hasMetaKey(rootMeta, slug)) {
    fail(`pages/release-notes/_meta.ts does not expose ${slug}`);
  }

  assertIncludes(
    productIndex,
    `# ${config.label} Release Notes`,
    `${slug}/index`,
  );

  const entries = fs
    .readdirSync(productDir)
    .filter((entry) => entry.endsWith(".mdx") && entry !== "index.mdx")
    .sort();

  if (entries.length === 0) {
    fail(`${slug} has no release-note entries`);
  }

  for (const filename of entries) {
    const notePath = path.join(productDir, filename);
    const noteLabel = path.relative(repoRoot, notePath);
    const note = readFile(notePath);
    const route = routeForNote(slug, filename);
    const metaKey = filename.replace(/\.mdx$/, "");

    if (!config.notePattern.test(filename)) {
      fail(`${noteLabel} does not match expected filename format`);
    }

    if (!hasFrontmatterField(note, "title")) {
      fail(`${noteLabel} is missing frontmatter title`);
    }

    if (!hasFrontmatterField(note, "description")) {
      fail(`${noteLabel} is missing frontmatter description`);
    }

    assertIncludes(note, "Published:", noteLabel);
    assertIncludes(note, `Product line: ${config.label}.`, noteLabel);

    for (const section of config.requiredSections) {
      assertIncludes(note, section, noteLabel);
    }

    if (!hasMetaKey(productMeta, metaKey)) {
      fail(
        `${path.relative(repoRoot, productMetaPath)} does not expose ${metaKey}`,
      );
    }

    assertIncludes(productIndex, route, `${slug}/index`);
    assertIncludes(allReleases, route, "pages/release-notes/all.mdx");
  }
}

const releaseFiles = listFiles(releaseRoot).filter((targetPath) =>
  targetPath.endsWith(".mdx"),
);

for (const targetPath of releaseFiles) {
  const rel = path.relative(releaseRoot, targetPath);
  const [firstSegment] = rel.split(path.sep);
  const isProductLine = Object.hasOwn(productLines, firstSegment);
  const isBridge = allowedBridgeDirs.has(firstSegment);
  const isRootFile = !rel.includes(path.sep) && allowedRootFiles.has(rel);

  if (!isProductLine && !isBridge && !isRootFile) {
    fail(
      `Unexpected release-note file: ${path.relative(repoRoot, targetPath)}`,
    );
  }

  const content = readFile(targetPath);

  for (const pattern of forbiddenPublicCopy) {
    if (pattern.test(content)) {
      fail(
        `${path.relative(repoRoot, targetPath)} contains forbidden public release-note copy: ${pattern}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error("Release note checks failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("release note checks passed");

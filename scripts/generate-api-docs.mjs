import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function mustExist(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${label}: ${filePath}`);
  }
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function listSolidityFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listSolidityFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".sol")) out.push(full);
  }
  return out;
}

function ensureEmptyDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function parseRemappings(remappingsPath, repoRoot) {
  if (!fs.existsSync(remappingsPath)) return [];
  const lines = readUtf8(remappingsPath)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));

  const remappings = [];
  for (const line of lines) {
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const prefix = line.slice(0, idx);
    const target = line.slice(idx + 1);
    if (!prefix || !target) continue;
    remappings.push({
      prefix,
      targetAbs: path.resolve(repoRoot, target),
    });
  }

  // Prefer longer (more specific) prefixes first.
  remappings.sort((a, b) => b.prefix.length - a.prefix.length);
  return remappings;
}

function applyRemappings(importPath, remappings) {
  for (const r of remappings) {
    if (importPath.startsWith(r.prefix)) {
      return path.join(r.targetAbs, importPath.slice(r.prefix.length));
    }
  }
  return importPath;
}

function stripProtocolV2Phrases(text) {
  return text
    .replaceAll("Tangle Protocol v2", "Tangle Protocol")
    .replaceAll("Protocol v2", "Protocol");
}

async function main() {
  const docsRoot = process.cwd();
  const tntCoreDir = process.env.TNT_CORE_DIR
    ? path.resolve(process.env.TNT_CORE_DIR)
    : path.resolve(docsRoot, "../tnt-core");
  const sourcesDir = path.join(tntCoreDir, "src/v2/interfaces");
  const outDir = path.join(docsRoot, "pages/developers/api/reference/generated");
  const remappings = parseRemappings(
    path.join(tntCoreDir, "remappings.txt"),
    tntCoreDir,
  );

  mustExist(tntCoreDir, "TNT_CORE_DIR (tnt-core checkout)");
  mustExist(sourcesDir, "tnt-core sources dir (src/v2/interfaces)");

  // solc-js (pinned as a dev dependency) compiles our interface files so solidity-docgen can render AST-based docs.
  const solc = require("solc");
  const { docgen } = require("solidity-docgen");

  const entryFiles = listSolidityFiles(sourcesDir);
  if (entryFiles.length === 0) {
    throw new Error(`No .sol files found under: ${sourcesDir}`);
  }

  const sources = {};
  for (const filePath of entryFiles) {
    sources[filePath] = { content: readUtf8(filePath) };
  }

  const input = {
    language: "Solidity",
    sources,
    settings: {
      optimizer: { enabled: false, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "devdoc", "userdoc", "metadata"],
          "": ["ast"],
        },
      },
    },
  };

  const importCallback = (importPath) => {
    try {
      // solc will pass either resolved absolute paths (when the importing unit has an absolute filename)
      // or the original import string. We support Foundry remappings so @openzeppelin/... resolves.
      const normalized = applyRemappings(path.normalize(importPath), remappings);
      if (!fs.existsSync(normalized)) return { error: `File not found: ${importPath}` };
      return { contents: readUtf8(normalized) };
    } catch (err) {
      return { error: String(err) };
    }
  };

  const compiled = JSON.parse(solc.compile(JSON.stringify(input), { import: importCallback }));
  if (compiled.errors?.length) {
    const fatal = compiled.errors.filter((e) => e.severity === "error");
    if (fatal.length) {
      for (const e of fatal) console.error(e.formattedMessage || e.message || e);
      throw new Error("solc compilation failed; see errors above.");
    }
  }

  // Reset output directory so old pages don't linger.
  ensureEmptyDir(outDir);

  // Feed solidity-docgen the same shape Hardhat uses: { input, output }.
  const builds = [{ input, output: compiled }];

  await docgen(builds, {
    // Note: sourcesDir can be outside docsRoot; solidity-docgen only uses it to scope which files become pages.
    sourcesDir,
    outputDir: path.relative(docsRoot, outDir),
    pages: "items",
    pageExtension: ".mdx",
    theme: "markdown",
    templates: "scripts/solidity-docgen/templates",
    collapseNewlines: true,
  });

  // Post-process generated pages to avoid "v2" naming in the docs site.
  for (const filePath of walkFiles(outDir)) {
    if (!filePath.endsWith(".mdx")) continue;
    const next = stripProtocolV2Phrases(readUtf8(filePath));
    fs.writeFileSync(filePath, next, "utf8");
  }

  console.log(`Generated Solidity API docs: ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

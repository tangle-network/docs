import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const auditDate = process.env.AUDIT_DATE || new Date().toISOString().slice(0, 10);
const outDir = path.join(repoRoot, "audits");
const scannerPath =
  process.env.DOCS_SLOP_SCANNER ||
  "/home/drew/code/dotfiles/claude/skills/docs-slop-audit/scripts/scan-docs-slop.mjs";

const slopWords =
  /\b(seamless|robust|powerful|comprehensive|cutting-edge|state-of-the-art|groundbreaking|revolutionary|game-changing|world-class|best-in-class|next-generation|landscape|paradigm|synergy|holistic|delve|unlock|showcase|leverage)\b/gi;
const throatClearing =
  /\b(here'?s what|here'?s why|here'?s the|at its core|it'?s worth noting|let'?s dive|let'?s unpack|the bottom line|make no mistake)\b/gi;
const weakSofteners =
  /\b(just|simply|actually|basically|really|very|extremely|generally|typically|easily)\b/gi;
const futureWords = /\b(coming soon|planned|roadmap|will support|will allow|will add|todo|tbd)\b/gi;
const claimWords =
  /\b(secure|verifiable|auditable|trustless|decentralized|production-grade|enterprise-grade|private)\b/gi;
const protocolWords =
  /\b(protocol|onchain|contract|contracts|governance|staking|slashing|restaking|blueprint|service instance|operator registration|service request)\b/i;
const hostedWords =
  /\b(hosted|gateway|router|sandbox|runtime|api key|cloud|intelligence\.tangle\.tools|router\.tangle\.tools|sandbox\.tangle\.tools)\b/i;
const boundaryWords =
  /\b(hosted|protocol|onchain|contract|service instance|operator api|sdk|infrastructure|not the protocol|does not|shared protocol indexer|product app|hosted app)\b/i;
const commandWords =
  /\b(yarn|npm|pnpm|cargo|forge|cast|curl|docker|kubectl|tangle|blueprint|git|cp |mv |export |source )\b/;
const actionWords =
  /\b(run|install|configure|deploy|register|request|approve|stake|delegate|withdraw|claim|create|set|verify|test|build|copy|open|connect|call|send)\b/i;
const sourceWords =
  /\b(ITangle|IBlueprint|BlueprintServiceManager|MasterBlueprintServiceManager|MultiAssetDelegation|Restaking|contract|event|function|version|v0\.\d+|EIP-|ERC-|commit|source|repo|repository|generated)\b/i;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

function stripCodeFences(content) {
  return content.replace(/```[\s\S]*?```/g, " ");
}

function stripMdx(content) {
  return stripCodeFences(content)
    .replace(/^import .*$/gm, " ")
    .replace(/^export .*$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/[`*_>#|[\]().,:;]/g, " ");
}

function words(content) {
  return stripMdx(content).match(/[A-Za-z0-9][A-Za-z0-9'/-]*/g) || [];
}

function countMatches(content, re) {
  return (content.match(re) || []).length;
}

function countLinesMatching(lines, re) {
  return lines.filter((line) => re.test(line)).length;
}

function clamp(value, min = 0, max = 10) {
  return Math.max(min, Math.min(max, value));
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[clamp(index, 0, sorted.length - 1)];
}

function median(values) {
  return percentile(values, 50);
}

function topLevel(file) {
  const parts = file.split(path.sep);
  return parts[1] || "root";
}

function pageKind(file) {
  if (file === "pages/index.mdx") return "home";
  if (file.includes("/developers/api/reference/")) return "api-reference";
  if (file.includes("/blueprints/")) return "blueprint";
  if (file.includes("/gateway/")) return "gateway";
  if (file.includes("/infrastructure/")) return "runtime-infra";
  if (file.includes("/operators/")) return "operator";
  if (file.includes("/staking/")) return "staking";
  if (file.includes("/network/")) return "network";
  if (file.includes("/developers/")) return "developer";
  if (file.includes("/vibe/")) return "workbench";
  if (file.includes("/vision/")) return "vision";
  if (file.includes("/release-notes/")) return "release";
  return "general";
}

function primaryAudience(kind, file) {
  if (kind === "operator") return "operator";
  if (kind === "developer" || kind === "api-reference") return "developer";
  if (kind === "staking" || kind === "network") return "staker/governance";
  if (kind === "gateway" || kind === "workbench") return "customer/developer";
  if (kind === "blueprint") {
    if (file.includes("operator-requirements")) return "operator";
    if (file.includes("dapp")) return "app developer";
    return "developer/operator";
  }
  return "general";
}

function parseHeadings(content) {
  const lines = content.split(/\r?\n/);
  const headings = [];
  let inFence = false;

  lines.forEach((line, index) => {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (inFence) return;
    const match = line.match(/^(#{1,4})\s+(.+?)\s*$/);
    if (!match) return;
    headings.push({
      depth: match[1].length,
      title: match[2].replace(/\s*\{#.*\}\s*$/, "").trim(),
      line: index + 1,
    });
  });

  return headings;
}

function splitSections(content) {
  const lines = content.split(/\r?\n/);
  const headings = parseHeadings(content);
  const sections = [];

  if (headings.length === 0) {
    return [
      {
        title: "Page Body",
        depth: 0,
        startLine: 1,
        endLine: lines.length,
        content,
      },
    ];
  }

  if (headings[0].line > 1) {
    sections.push({
      title: "Page Intro",
      depth: 0,
      startLine: 1,
      endLine: headings[0].line - 1,
      content: lines.slice(0, headings[0].line - 1).join("\n"),
    });
  }

  headings.forEach((heading, index) => {
    const next = headings[index + 1];
    const endLine = next ? next.line - 1 : lines.length;
    sections.push({
      title: heading.title,
      depth: heading.depth,
      startLine: heading.line,
      endLine,
      content: lines.slice(heading.line - 1, endLine).join("\n"),
    });
  });

  return sections.filter((section) => words(section.content).length > 0);
}

function runScanner() {
  if (!fs.existsSync(scannerPath)) {
    return { scannedFiles: 0, findingCount: 0, findings: [] };
  }

  const result = spawnSync(process.execPath, [scannerPath, "--json", "pages"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" },
  });

  if (result.status !== 0) {
    throw new Error(`docs slop scanner failed:\n${result.stderr || result.stdout}`);
  }

  return JSON.parse(result.stdout);
}

function summarizeFindings(findings) {
  return {
    high: findings.filter((finding) => finding.severity === "high").length,
    medium: findings.filter((finding) => finding.severity === "medium").length,
    low: findings.filter((finding) => finding.severity === "low").length,
  };
}

function analyzeContent(content, findings, kind) {
  const rawLines = content.split(/\r?\n/);
  const text = stripMdx(content);
  const wordList = words(content);
  const wordCount = wordList.length;
  const sentenceWordCounts = text
    .split(/[.!?]\s+/)
    .map((sentence) => words(sentence).length)
    .filter(Boolean);
  const longSentences = sentenceWordCounts.filter((count) => count > 32).length;
  const headings = parseHeadings(content);
  const h1Count = headings.filter((heading) => heading.depth === 1).length;
  const codeFences = countMatches(content, /```/g) / 2;
  const links = countMatches(content, /\[[^\]]+\]\([^)]+\)/g);
  const tables = countLinesMatching(rawLines, /^\s*\|/);
  const listItems = countLinesMatching(rawLines, /^\s*[-*]\s+|^\s*\d+\.\s+/);
  const commands = countLinesMatching(rawLines, commandWords);
  const actions = countMatches(text, actionWords);
  const slop = countMatches(text, slopWords);
  const throat = countMatches(text, throatClearing);
  const softeners = countMatches(text, weakSofteners);
  const future = countMatches(text, futureWords);
  const claims = countMatches(text, claimWords);
  const sourceRefs = countMatches(text, sourceWords) + links + codeFences;
  const touchesBoundary = protocolWords.test(text) && hostedWords.test(text);
  const hasBoundary = boundaryWords.test(text);
  const boundaryRisk = touchesBoundary && !hasBoundary ? 1 : 0;
  const severity = summarizeFindings(findings);
  const density = wordCount > 0 ? 500 / Math.max(wordCount, 250) : 1;
  const generated = kind === "api-reference";

  const voice = clamp(
    9 -
      (slop * 0.35 + throat * 0.4 + softeners * 0.08) * density -
      severity.medium * 0.18 -
      severity.low * 0.06,
  );

  const clarity = clamp(
    8.6 -
      longSentences * 0.25 * density -
      severity.high * 0.28 -
      severity.medium * 0.12 -
      (wordCount > 250 && headings.length === 0 ? 1.2 : 0),
  );

  const structure = clamp(
    8.4 +
      (h1Count === 1 ? 0.4 : 0) -
      (h1Count === 0 && !generated ? 0.8 : 0) -
      (h1Count > 1 ? 0.8 : 0) -
      (wordCount > 700 && headings.length < 3 ? 1 : 0) -
      (headings.length > 18 ? 0.4 : 0),
  );

  const actionabilityNeed =
    kind === "vision" || kind === "home" ? 0.45 : kind === "api-reference" ? 0.65 : 1;
  const actionSignals =
    codeFences * 0.9 + commands * 0.45 + listItems * 0.08 + tables * 0.05 + actions * 0.04;
  const actionability = clamp(5.6 + actionSignals * actionabilityNeed);

  const targetWords = generated ? 160 : kind === "vision" ? 300 : 420;
  const completeness = clamp(
    8.4 -
      (wordCount < targetWords ? (targetWords - wordCount) / targetWords * 2.6 : 0) -
      (wordCount > 1800 ? 0.4 : 0) +
      Math.min(headings.length * 0.08 + links * 0.04 + tables * 0.02, 0.9),
  );

  const sourceGrounding = clamp(
    5.8 +
      Math.min(sourceRefs * 0.22, 2.4) +
      (generated ? 1.2 : 0) -
      severity.high * 0.22 -
      (claims > sourceRefs + 2 ? 0.8 : 0),
  );

  const boundaryClarity = clamp(
    8.6 -
      boundaryRisk * 1.8 -
      findings.filter((finding) => finding.rule === "boundary-hosted-protocol").length * 1.2 -
      findings.filter((finding) => finding.rule === "single-harness-opencode").length * 1.3 +
      (touchesBoundary && hasBoundary ? 0.4 : 0),
  );

  const freshness = clamp(
    8.7 -
      future * 0.45 -
      findings.filter((finding) => finding.rule === "coming-soon-live-state").length * 1.1 -
      (/\btestnet\b/i.test(text) && !/\bmainnet|local|current|as of|v0\./i.test(text) ? 0.4 : 0),
  );

  const examples = clamp(
    5.7 +
      Math.min(codeFences * 0.8 + commands * 0.3 + tables * 0.08, 2.8) -
      (kind === "developer" && codeFences === 0 ? 0.8 : 0) -
      (kind === "operator" && tables === 0 && listItems < 5 ? 0.7 : 0),
  );

  const audienceFit = clamp(
    7.6 +
      (kind === "operator" && /requirements|sizing|security|runbook|benchmark|stake|monitor/i.test(text)
        ? 0.9
        : 0) +
      (kind === "developer" && /install|sdk|api|contract|example|function|deploy/i.test(text)
        ? 0.7
        : 0) +
      (kind === "gateway" && /api|model|provider|routing|key|header/i.test(text) ? 0.6 : 0) -
      (wordCount < 180 && !generated ? 0.8 : 0) -
      severity.high * 0.18,
  );

  const weights =
    kind === "api-reference"
      ? {
          clarity: 0.16,
          actionability: 0.08,
          completeness: 0.12,
          sourceGrounding: 0.22,
          boundaryClarity: 0.08,
          freshness: 0.1,
          voice: 0.08,
          structure: 0.08,
          examples: 0.04,
          audienceFit: 0.04,
        }
      : {
          clarity: 0.15,
          actionability: 0.13,
          completeness: 0.13,
          sourceGrounding: 0.12,
          boundaryClarity: 0.12,
          freshness: 0.09,
          voice: 0.1,
          structure: 0.08,
          examples: 0.04,
          audienceFit: 0.04,
        };

  const scores = {
    voice: round(voice),
    clarity: round(clarity),
    structure: round(structure),
    actionability: round(actionability),
    completeness: round(completeness),
    sourceGrounding: round(sourceGrounding),
    boundaryClarity: round(boundaryClarity),
    freshness: round(freshness),
    examples: round(examples),
    audienceFit: round(audienceFit),
  };

  const overall = Object.entries(weights).reduce(
    (sum, [key, weight]) => sum + scores[key] * weight,
    0,
  );

  return {
    scores: { overall: round(overall), ...scores },
    metrics: {
      words: wordCount,
      headings: headings.length,
      h1Count,
      codeFences,
      links,
      tables,
      listItems,
      commands,
      longSentences,
      slop,
      throat,
      softeners,
      future,
      claims,
      sourceRefs,
      touchesBoundary,
      hasBoundary,
      boundaryRisk,
      findings: severity,
    },
  };
}

function issueSummary(metrics) {
  const issues = [];
  if (metrics.findings.high > 0) issues.push(`${metrics.findings.high} high scanner findings`);
  if (metrics.boundaryRisk) issues.push("protocol/hosted boundary needs sharper wording");
  if (metrics.future > 0) issues.push(`${metrics.future} future-tense/staleness terms`);
  if (metrics.slop + metrics.throat > 0) issues.push(`${metrics.slop + metrics.throat} slop phrases`);
  if (metrics.words < 180) issues.push("thin page");
  if (metrics.codeFences === 0 && metrics.commands === 0) issues.push("few executable examples");
  if (issues.length === 0) return "none obvious from rubric";
  return issues.slice(0, 3).join("; ");
}

function sectionScores(content, findings, kind) {
  const analyzed = analyzeContent(content, findings, kind);
  const riskPenalty =
    analyzed.metrics.findings.high * 0.45 +
    analyzed.metrics.findings.medium * 0.18 +
    analyzed.metrics.boundaryRisk * 0.8;
  return {
    score: round(
      clamp(
        analyzed.scores.clarity * 0.22 +
          analyzed.scores.actionability * 0.2 +
          analyzed.scores.sourceGrounding * 0.16 +
          analyzed.scores.voice * 0.14 +
          analyzed.scores.structure * 0.08 +
          analyzed.scores.freshness * 0.1 +
          analyzed.scores.boundaryClarity * 0.1 -
          riskPenalty,
      ),
    ),
    clarity: analyzed.scores.clarity,
    actionability: analyzed.scores.actionability,
    evidence: analyzed.scores.sourceGrounding,
    voice: analyzed.scores.voice,
    freshness: analyzed.scores.freshness,
    boundaryClarity: analyzed.scores.boundaryClarity,
    metrics: analyzed.metrics,
  };
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows, columns) {
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
  ].join("\n");
}

function histogram(values) {
  const buckets = [
    { label: "0-5.9", min: 0, max: 5.9 },
    { label: "6.0-6.9", min: 6, max: 6.9 },
    { label: "7.0-7.9", min: 7, max: 7.9 },
    { label: "8.0-8.9", min: 8, max: 8.9 },
    { label: "9.0-10", min: 9, max: 10 },
  ];
  const maxCount = Math.max(
    1,
    ...buckets.map((bucket) => values.filter((value) => value >= bucket.min && value <= bucket.max).length),
  );
  return buckets
    .map((bucket) => {
      const count = values.filter((value) => value >= bucket.min && value <= bucket.max).length;
      const bar = "█".repeat(Math.round((count / maxCount) * 24));
      return `${bucket.label.padEnd(8)} ${bar} ${count}`;
    })
    .join("\n");
}

function formatTable(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(" | ")} |`;
  const separator = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map(
    (row) => `| ${columns.map((column) => String(row[column.key] ?? "")).join(" | ")} |`,
  );
  return [header, separator, ...body].join("\n");
}

const scanner = runScanner();
const scannerFindings = scanner.findings.map((finding) => ({
  ...finding,
  file: path.relative(repoRoot, finding.file),
}));

const findingsByFile = new Map();
for (const finding of scannerFindings) {
  if (!findingsByFile.has(finding.file)) findingsByFile.set(finding.file, []);
  findingsByFile.get(finding.file).push(finding);
}

const pageFiles = walk(path.join(repoRoot, "pages"))
  .map((file) => path.relative(repoRoot, file))
  .sort();

const pages = [];
const sections = [];

for (const file of pageFiles) {
  const content = fs.readFileSync(path.join(repoRoot, file), "utf8");
  const kind = pageKind(file);
  const findings = findingsByFile.get(file) || [];
  const analysis = analyzeContent(content, findings, kind);
  const headings = parseHeadings(content);
  const title = headings.find((heading) => heading.depth === 1)?.title || path.basename(file, ".mdx");

  pages.push({
    file,
    area: topLevel(file),
    kind,
    audience: primaryAudience(kind, file),
    title,
    overall: analysis.scores.overall,
    voice: analysis.scores.voice,
    clarity: analysis.scores.clarity,
    structure: analysis.scores.structure,
    actionability: analysis.scores.actionability,
    completeness: analysis.scores.completeness,
    sourceGrounding: analysis.scores.sourceGrounding,
    boundaryClarity: analysis.scores.boundaryClarity,
    freshness: analysis.scores.freshness,
    examples: analysis.scores.examples,
    audienceFit: analysis.scores.audienceFit,
    words: analysis.metrics.words,
    headings: analysis.metrics.headings,
    highFindings: analysis.metrics.findings.high,
    mediumFindings: analysis.metrics.findings.medium,
    lowFindings: analysis.metrics.findings.low,
    issueSummary: issueSummary(analysis.metrics),
  });

  for (const section of splitSections(content)) {
    const sectionFindings = findings.filter(
      (finding) => finding.line >= section.startLine && finding.line <= section.endLine,
    );
    const scores = sectionScores(section.content, sectionFindings, kind);
    sections.push({
      file,
      section: section.title,
      depth: section.depth,
      startLine: section.startLine,
      endLine: section.endLine,
      score: scores.score,
      clarity: scores.clarity,
      actionability: scores.actionability,
      evidence: scores.evidence,
      voice: scores.voice,
      freshness: scores.freshness,
      boundaryClarity: scores.boundaryClarity,
      words: scores.metrics.words,
      highFindings: scores.metrics.findings.high,
      mediumFindings: scores.metrics.findings.medium,
      lowFindings: scores.metrics.findings.low,
      issueSummary: issueSummary(scores.metrics),
    });
  }
}

const pageScores = pages.map((page) => page.overall);
const sectionScoreValues = sections.map((section) => section.score);
const areas = [...new Set(pages.map((page) => page.area))].sort();
const areaRows = areas.map((area) => {
  const areaPages = pages.filter((page) => page.area === area);
  const values = areaPages.map((page) => page.overall);
  return {
    area,
    pages: areaPages.length,
    min: round(Math.min(...values)),
    median: round(median(values)),
    p90: round(percentile(values, 90)),
    max: round(Math.max(...values)),
    highFindings: areaPages.reduce((sum, page) => sum + page.highFindings, 0),
    medianVoice: round(median(areaPages.map((page) => page.voice))),
    medianActionability: round(median(areaPages.map((page) => page.actionability))),
  };
});

const findingCounts = summarizeFindings(scannerFindings);
const worstPages = [...pages].sort((a, b) => a.overall - b.overall).slice(0, 35);
const bestPages = [...pages].sort((a, b) => b.overall - a.overall).slice(0, 20);
const worstSections = [...sections].sort((a, b) => a.score - b.score).slice(0, 80);

const pageColumns = [
  "file",
  "area",
  "kind",
  "audience",
  "overall",
  "voice",
  "clarity",
  "structure",
  "actionability",
  "completeness",
  "sourceGrounding",
  "boundaryClarity",
  "freshness",
  "examples",
  "audienceFit",
  "words",
  "headings",
  "highFindings",
  "mediumFindings",
  "lowFindings",
  "issueSummary",
];
const sectionColumns = [
  "file",
  "section",
  "depth",
  "startLine",
  "endLine",
  "score",
  "clarity",
  "actionability",
  "evidence",
  "voice",
  "freshness",
  "boundaryClarity",
  "words",
  "highFindings",
  "mediumFindings",
  "lowFindings",
  "issueSummary",
];

fs.mkdirSync(outDir, { recursive: true });

const jsonPath = path.join(outDir, `${auditDate}-docs-quality.json`);
const pagesCsvPath = path.join(outDir, `${auditDate}-docs-quality-pages.csv`);
const sectionsCsvPath = path.join(outDir, `${auditDate}-docs-quality-sections.csv`);
const markdownPath = path.join(outDir, `${auditDate}-docs-quality.md`);

fs.writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      auditDate,
      method: {
        pageCount: pages.length,
        sectionCount: sections.length,
        scannerPath,
        scannerFindings: scanner.findingCount,
        dimensions: pageColumns.slice(4, 15),
      },
      summary: {
        pages: {
          min: round(Math.min(...pageScores)),
          median: round(median(pageScores)),
          p90: round(percentile(pageScores, 90)),
          max: round(Math.max(...pageScores)),
        },
        sections: {
          min: round(Math.min(...sectionScoreValues)),
          median: round(median(sectionScoreValues)),
          p90: round(percentile(sectionScoreValues, 90)),
          max: round(Math.max(...sectionScoreValues)),
        },
        findings: findingCounts,
        areas: areaRows,
      },
      pages,
      sections,
      scannerFindings,
    },
    null,
    2,
  )}\n`,
);
fs.writeFileSync(pagesCsvPath, `${toCsv(pages, pageColumns)}\n`);
fs.writeFileSync(sectionsCsvPath, `${toCsv(sections, sectionColumns)}\n`);

const markdown = `# Docs Quality Audit (${auditDate})

## Verdict

Median page score is **${round(median(pageScores))}/10** across **${pages.length} pages**. Median subsection score is **${round(median(sectionScoreValues))}/10** across **${sections.length} subsections**. The scanner found **${scanner.findingCount} copy/fact-risk findings**: ${findingCounts.high} high, ${findingCounts.medium} medium, ${findingCounts.low} low.

## Method

- Source: \`pages/**/*.mdx\`
- Page count: ${pages.length}
- Subsection count: ${sections.length}
- Slop/fact-risk scanner: \`${scannerPath}\`
- Output files:
  - \`${path.relative(repoRoot, jsonPath)}\`
  - \`${path.relative(repoRoot, pagesCsvPath)}\`
  - \`${path.relative(repoRoot, sectionsCsvPath)}\`

Scores are **rubric ratings**, not proof of factual truth. The measured inputs are word counts, heading structure, code/table/link density, scanner findings, stale-language markers, claim terms, and boundary-language markers.

## Dimensions

- **overall**: weighted score from all dimensions.
- **voice**: human writing, low filler, low hype, low formulaic copy.
- **clarity**: sentence clarity, specific actors/mechanisms, low scanner risk.
- **structure**: heading shape, page organization, navigable density.
- **actionability**: steps, commands, examples, tables, calls readers can execute.
- **completeness**: enough coverage for the page type without thin placeholders.
- **sourceGrounding**: links, contract/function names, versions, source references.
- **boundaryClarity**: hosted infrastructure vs protocol vs product boundaries.
- **freshness**: low stale future tense, launch-state ambiguity, TODO/TBD copy.
- **examples**: concrete code/CLI/API/operator examples where relevant.
- **audienceFit**: match to developer/operator/staker/customer needs.

## Score Distribution

\`\`\`text
Pages (n=${pages.length})    min=${round(Math.min(...pageScores))} median=${round(median(pageScores))} p90=${round(percentile(pageScores, 90))} max=${round(Math.max(...pageScores))}
${histogram(pageScores)}

Sections (n=${sections.length}) min=${round(Math.min(...sectionScoreValues))} median=${round(median(sectionScoreValues))} p90=${round(percentile(sectionScoreValues, 90))} max=${round(Math.max(...sectionScoreValues))}
${histogram(sectionScoreValues)}
\`\`\`

## Area Summary

${formatTable(areaRows, [
  { key: "area", label: "Area" },
  { key: "pages", label: "Pages" },
  { key: "median", label: "Median" },
  { key: "min", label: "Min" },
  { key: "p90", label: "P90" },
  { key: "max", label: "Max" },
  { key: "highFindings", label: "High Findings" },
  { key: "medianVoice", label: "Voice" },
  { key: "medianActionability", label: "Actionability" },
])}

## Lowest-Rated Pages

${formatTable(worstPages, [
  { key: "overall", label: "Score" },
  { key: "file", label: "Page" },
  { key: "kind", label: "Kind" },
  { key: "voice", label: "Voice" },
  { key: "actionability", label: "Action" },
  { key: "sourceGrounding", label: "Grounding" },
  { key: "boundaryClarity", label: "Boundary" },
  { key: "issueSummary", label: "Main Issues" },
])}

## Highest-Rated Pages

${formatTable(bestPages, [
  { key: "overall", label: "Score" },
  { key: "file", label: "Page" },
  { key: "kind", label: "Kind" },
  { key: "voice", label: "Voice" },
  { key: "actionability", label: "Action" },
  { key: "sourceGrounding", label: "Grounding" },
  { key: "boundaryClarity", label: "Boundary" },
])}

## Lowest-Rated Subsections

The full subsection table is in \`${path.relative(repoRoot, sectionsCsvPath)}\`. The table below lists the lowest 80 sections so the first edit pass has a concrete queue.

${formatTable(worstSections, [
  { key: "score", label: "Score" },
  { key: "file", label: "Page" },
  { key: "section", label: "Section" },
  { key: "startLine", label: "Line" },
  { key: "voice", label: "Voice" },
  { key: "actionability", label: "Action" },
  { key: "evidence", label: "Evidence" },
  { key: "issueSummary", label: "Main Issues" },
])}

## Full Page Ratings

${formatTable(pages, [
  { key: "overall", label: "Score" },
  { key: "file", label: "Page" },
  { key: "kind", label: "Kind" },
  { key: "audience", label: "Audience" },
  { key: "voice", label: "Voice" },
  { key: "clarity", label: "Clarity" },
  { key: "actionability", label: "Action" },
  { key: "completeness", label: "Complete" },
  { key: "sourceGrounding", label: "Grounding" },
  { key: "boundaryClarity", label: "Boundary" },
  { key: "freshness", label: "Fresh" },
  { key: "issueSummary", label: "Main Issues" },
])}

## Threats To Validity

- This is a quantitative first pass. It catches weak structure, thin pages, stale language, poor examples, and boundary-risk copy, but it does not prove every technical statement against source code.
- Generated API reference pages score differently because source grounding matters more than prose style.
- Very short reference pages can score lower on actionability even when they are intentionally compact.
- Product-state claims still need repo/deploy verification before rewrite.
`;

fs.writeFileSync(markdownPath, markdown);

console.log(
  JSON.stringify(
    {
      pages: pages.length,
      sections: sections.length,
      findings: findingCounts,
      pageScore: {
        min: round(Math.min(...pageScores)),
        median: round(median(pageScores)),
        p90: round(percentile(pageScores, 90)),
        max: round(Math.max(...pageScores)),
      },
      sectionScore: {
        min: round(Math.min(...sectionScoreValues)),
        median: round(median(sectionScoreValues)),
        p90: round(percentile(sectionScoreValues, 90)),
        max: round(Math.max(...sectionScoreValues)),
      },
      outputs: {
        markdown: path.relative(repoRoot, markdownPath),
        json: path.relative(repoRoot, jsonPath),
        pagesCsv: path.relative(repoRoot, pagesCsvPath),
        sectionsCsv: path.relative(repoRoot, sectionsCsvPath),
      },
    },
    null,
    2,
  ),
);

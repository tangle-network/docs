import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["pages", "components"];
const EXTENSIONS = new Set([".md", ".mdx", ".ts", ".tsx", ".js", ".jsx"]);
const OPENCODE_RE = /\b(open\s*code|opencode|OPENCODE|OpenCode)\b/;
const PEER_RE =
  /\b(Claude Code|Codex|AMP|Factory Droids|Kimi Code|Pi|Forge|ACP|Cursor|Hermes|CLI base|Gemini CLI|\/infrastructure\/harnesses|\/api\/capabilities|supported harnesses|peer harnesses|other supported harnesses)\b/;

function extension(path) {
  const dot = path.lastIndexOf(".");
  return dot === -1 ? "" : path.slice(dot);
}

function walk(path, files = []) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) walk(join(path, entry), files);
    return files;
  }
  if (stat.isFile() && EXTENSIONS.has(extension(path))) files.push(path);
  return files;
}

const findings = [];

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((line, index) => {
      if (!OPENCODE_RE.test(line)) return;

      const start = Math.max(0, index - 8);
      const end = Math.min(lines.length, index + 9);
      const context = lines.slice(start, end).join("\n");

      if (PEER_RE.test(context)) return;

      findings.push({
        file: relative(process.cwd(), file),
        line: index + 1,
        text: line.trim(),
      });
    });
  }
}

if (findings.length > 0) {
  console.error(
    "OpenCode must be framed beside the supported sandbox harness set.\n" +
      "Mention peer harnesses nearby or link to /infrastructure/harnesses.\n",
  );
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} ${finding.text}`);
  }
  process.exit(1);
}

console.log("OpenCode harness framing check passed.");

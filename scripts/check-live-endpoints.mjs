// Fails when a URL the docs tell people to call is dead at the origin.
//
// The link checker only reads markdown link syntax in scanned pages, so a URL
// sitting inside a fenced code block or a .tsx component is invisible to it.
// That is exactly how rpc.tangle.tools stayed documented while returning 521.
// This checks those too.
//
// Deliberately narrow: only hard origin failures fail the build (5xx and
// connection failures). Auth walls, method restrictions, and rate limits mean
// the host is alive, which is all this check claims to prove.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["pages", "components"];
const EXTENSIONS = new Set([".md", ".mdx", ".ts", ".tsx", ".js", ".jsx"]);
const URL_RE = /https?:\/\/[a-zA-Z0-9._~:/?#@!$&*+,;=%-]+/g;

// Not real destinations: local dev, illustrative hosts, and template slots.
const SKIP_RE =
  /localhost|127\.0\.0\.1|0\.0\.0\.0|example\.(com|org|net)|YOUR_|your-|<|\{|\}|\.\.\.|placeholder|xxx/i;

// Only public hosts are checkable from CI. A private/internal name in an example
// config is correct documentation, not a dead endpoint.
function isPublicHost(url) {
  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    return false; // not a parseable URL (e.g. a bare "https://" in prose)
  }
  if (!host.includes(".")) return false; // intranet-style single-label host
  return !/\.(internal|local|localdomain|test|invalid|example)$/i.test(host);
}

// The host answered, so it exists. Only the origin being down is a docs defect.
const ALIVE = new Set([
  200, 201, 202, 204, 301, 302, 303, 304, 307, 308, 400, 401, 403, 404, 405,
  406, 409, 410, 415, 422, 429,
]);

function walk(path, files = []) {
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) walk(join(path, entry), files);
    return files;
  }
  const dot = path.lastIndexOf(".");
  if (stat.isFile() && EXTENSIONS.has(dot === -1 ? "" : path.slice(dot)))
    files.push(path);
  return files;
}

const seen = new Map(); // url -> first file that used it
for (const root of ROOTS) {
  for (const file of walk(root)) {
    for (const raw of readFileSync(file, "utf8").match(URL_RE) ?? []) {
      const url = raw.replace(/[.,);:'"`\]]+$/, "");
      if (SKIP_RE.test(url) || !isPublicHost(url) || seen.has(url)) continue;
      seen.set(url, file);
    }
  }
}

async function probe(url) {
  // Two attempts: a transient blip should not fail the build.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (ALIVE.has(res.status)) return null;
      if (attempt === 1) return `HTTP ${res.status}`;
    } catch (error) {
      if (attempt === 1)
        return error.name === "AbortError" ? "timeout" : "unreachable";
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return null;
}

const urls = [...seen.keys()];
const dead = [];
const CONCURRENCY = 12;
for (let i = 0; i < urls.length; i += CONCURRENCY) {
  const batch = urls.slice(i, i + CONCURRENCY);
  const outcomes = await Promise.all(batch.map((url) => probe(url)));
  outcomes.forEach((reason, index) => {
    if (reason)
      dead.push({ url: batch[index], file: seen.get(batch[index]), reason });
  });
}

if (dead.length > 0) {
  console.error(
    `${dead.length} documented endpoint(s) are dead at the origin.\n` +
      "The docs tell people to call these. Fix or remove them.\n",
  );
  for (const { url, file, reason } of dead)
    console.error(`${file}: ${url} (${reason})`);
  process.exit(1);
}

console.log(`Live endpoint check passed. ${urls.length} URLs reachable.`);

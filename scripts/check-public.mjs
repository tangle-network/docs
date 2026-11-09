#!/usr/bin/env node
// Public-surface checks for tangle.tools and docs.tangle.tools: broken links, claims that disagree with
// their source record, and banned copy patterns. The same file runs in tangle-website and tangle-docs.
//
//   node scripts/check-public.mjs dist <dir> <origin>    pre-deploy: built pages; fails on a broken internal
//                                                        link, a claim mismatch or a new copy failure
//   node scripts/check-public.mjs live [--out f.json] [--md f.md]
//                                                        weekly crawl of the live sites; always writes the report
//
// Copy lint is deterministic: headings, buttons and meta descriptions fail; body matches are reported only.
// scripts/public-baseline.json lists copy failures that already existed when the check was added; it only shrinks.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const extract = existsSync(new URL('./extract-copy.mjs', import.meta.url))
  ? (await import('./extract-copy.mjs')).extractCopy
  : (html) => html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<\/(p|h[1-6]|li|div|tr)>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/[ \t]+/g, ' ');
const UA = 'tangle-public-checks/1 (+https://github.com/tangle-network/tangle-website)';
const LIVE_SITES = [
  { name: 'tangle.tools', origin: 'https://tangle.tools', sitemap: '/sitemap-0.xml' },
  { name: 'docs.tangle.tools', origin: 'https://docs.tangle.tools', sitemap: '/sitemap-0.xml' },
  { name: 'router.tangle.tools', origin: 'https://router.tangle.tools', routes: ['/'] },
  { name: 'sandbox.tangle.tools', origin: 'https://sandbox.tangle.tools', routes: ['/'] },
  { name: 'intelligence.tangle.tools', origin: 'https://intelligence.tangle.tools', routes: ['/'] },
];

// ---------- copy lint ----------
// Sources: dotfiles docs/anti-patterns/copywriting.md, the brand copy bible, copywriting.tangle.md.
const BANNED = /\b(delve|foster|leverage|utilize|facilitate|empower|streamline|robust|cutting-edge|paradigm shift|game[- ]?changer|tapestry|realm|beacon|multifaceted|meticulous|intricate|paramount|transformative|elevate|embark|supercharge|ever-evolving|seamless(ly)?|powerful platform|unlock(ing)? (the )?potential|designed for modern teams|ai-native)\b/i;
const REJECTED = /^(Infrastructure for AI Agents|The platform loop|What Tangle builds|Open source substrate|Proof over positioning|Use the pieces directly|Start with one agent run|Three anchor pieces|Follow the argument by system layer|Ready to build the future)[.?!]?$/i;
const SHORT_RULES = [
  ['banned word', BANNED],
  ['rejected phrase', REJECTED],
  ['generic heading', /^(how it works|everything you need\b.*|built for\b.*|learn more|click here|better, faster, safer)\.?$/i],
  ['binary contrast', /\bnot just\b.+\bbut\b|\b(it'?s|isn'?t|is not) (not )?[^,.]{2,40}, (it'?s|but)\b/i],
  ['em dash', /—/],
];
const VOICE = ['bible voice word', /\b(harness(es)?|primitives?|substrate|tooling|tiles?)\b/i];
const BODY_RULES = [
  ['banned word', BANNED],
  ['empty phrase', /\b(it'?s (worth|important) noting|at the end of the day|when it comes to|at its core|in today'?s world|in the age of|let'?s dive in|going forward|the reality is|the truth is)\b/i],
  ['throat-clearing opener', /\b(here'?s the thing|let me be clear|what most people get wrong)\b/i],
  ['binary contrast', /\b(it'?s|this is) not [^,.]{2,50}, (it'?s|it is)\b/i],
];
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x?27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const metaDescriptions = (html) => [...html.matchAll(/<meta\b[^>]*\b(?:name|property)="(?:description|og:description|twitter:description)"[^>]*>/gi)].map((m) => text(/\bcontent="([^"]*)"/i.exec(m[0])?.[1] ?? '')).filter(Boolean);

export function shortCopy(html) {
  const bare = html.replace(/<(script|style|pre|code)\b[\s\S]*?<\/\1>/gi, '');
  const main = bare.match(/<main\b[\s\S]*<\/main>/i)?.[0] ?? bare;
  const items = [];
  for (const m of main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) items.push(['heading', text(m[2])]);
  for (const m of bare.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) items.push(['button', text(m[1])]);
  for (const m of bare.matchAll(/<a\b[^>]*\bclass="[^"]*\b(?:btn|button|cta)[\w-]*[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)) items.push(['button', text(m[1])]);
  for (const d of metaDescriptions(html)) items.push(['meta description', d]);
  items.push(['title', text(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '')]);
  return items.filter(([, t]) => t);
}

export function lintCopy(html, { voice }) {
  const failures = [];
  for (const [kind, t] of shortCopy(html)) {
    for (const [rule, re] of [...SHORT_RULES, ...(voice ? [VOICE] : [])]) if (re.test(t)) failures.push({ kind, rule, text: t.slice(0, 160) });
  }
  const seen = new Set();
  const body = [];
  for (const line of extract(html).split('\n')) {
    for (const [rule, re] of BODY_RULES) {
      const m = re.exec(line);
      if (m && !seen.has(rule + line)) { seen.add(rule + line); body.push({ rule, match: m[0], text: line.trim().slice(0, 160) }); }
    }
  }
  return { failures: [...new Map(failures.map((f) => [`${f.kind}|${f.rule}|${f.text}`, f])).values()], body };
}

// ---------- links ----------
export function hrefs(html) {
  const out = new Set();
  for (const m of html.matchAll(/<a\b[^>]*\shref=(?:"([^"]*)"|'([^']*)')/gi)) out.add((m[1] ?? m[2]).replace(/&amp;/g, '&').trim());
  return [...out].filter((h) => h && !/^(#|mailto:|tel:|javascript:|data:|blob:)/i.test(h));
}

function parseRedirects(file) {
  const src = readFileSync(file, 'utf8');
  if (file.endsWith('.toml')) return [...src.matchAll(/\[\[redirects\]\][^[]*?from\s*=\s*"([^"]+)"[^[]*?to\s*=\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]);
  return src.split('\n').map((l) => l.trim().split(/\s+/)).filter((p) => p.length >= 2 && !p[0].startsWith('#')).map((p) => [p[0], p[1]]);
}

function distResolver(dir, redirectFiles) {
  const redirects = redirectFiles.flatMap(parseRedirects);
  const exists = (p) => existsSync(p) && statSync(p).isFile();
  const resolves = (path, depth = 0) => {
    let p;
    try { p = decodeURIComponent(path); } catch { p = path; }
    const base = join(dir, p);
    if (exists(base) || exists(join(base, 'index.html')) || exists(`${base}.html`)) return true;
    if (depth > 4) return false;
    for (const [from, to] of redirects) {
      const star = from.endsWith('*');
      const hit = star ? p.startsWith(from.slice(0, -1)) : p === from || p === `${from}/` || `${p}/` === from;
      if (!hit) continue;
      if (/^https?:/.test(to)) return true;
      return resolves(to.replace(':splat', star ? p.slice(from.length - 1) : ''), depth + 1);
    }
    return false;
  };
  return { resolves, redirects };
}

async function probe(url) {
  const attempt = async (method) => {
    const res = await fetch(url, { method, redirect: 'follow', headers: { 'user-agent': UA, accept: 'text/html,*/*' }, signal: AbortSignal.timeout(20000) });
    await res.body?.cancel();
    return res.status;
  };
  for (let i = 0; i < 2; i += 1) {
    try {
      let status = await attempt('HEAD');
      if (status >= 400) status = await attempt('GET');
      return { status };
    } catch (error) {
      if (i === 1) return { status: 0, error: String(error.cause?.code ?? error.name) };
    }
  }
}

const classify = ({ status, error }) => {
  if (status >= 200 && status < 400) return 'ok';
  if (status === 404 || status === 410 || error === 'ENOTFOUND') return 'broken';
  if ([401, 403, 429, 999].includes(status)) return 'blocked';
  return 'unreachable';
};

async function pool(items, size, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: size }, async () => { for (let item = queue.shift(); item !== undefined; item = queue.shift()) await fn(item); }));
}

// ---------- claims ----------
const cache = new Map();
const once = (key, fn) => { if (!cache.has(key)) cache.set(key, fn()); return cache.get(key); };
// Resolves to the body on 200, null on 404, and undefined when the source cannot be read (network error, 5xx).
const fetchBody = (url, parse) => once(url, async () => { const r = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20000) }).catch(() => null); return r?.status === 200 ? r[parse]() : r?.status === 404 ? null : undefined; });

function span(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const s = ms / 1000;
  if (s < 10) return `${Math.round(s * 10) / 10}s`;
  if (s < 60) return `${Math.round(s)}s`;
  const m = Math.floor(s / 60), r = Math.round(s - m * 60);
  return r ? `${m}m ${r}s` : `${m}m`;
}
const sandboxRecord = () => {
  const file = new URL('../src/data/benchmarks/sandbox.json', import.meta.url);
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
};

// Each claim reads a page and returns {checked, mismatches[]}; a mismatch names the claim as printed,
// what the source says and where the source is.
export const CLAIMS = [
  {
    id: 'benchmarks-headline',
    source: 'src/data/benchmarks/sandbox.json (the record /benchmarks is built from)',
    async run(page) {
      const data = sandboxRecord();
      if (page.route !== '/benchmarks/' || !data) return { checked: 0, mismatches: [] };
      const t = text(page.html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ''));
      const mismatches = [];
      let checked = 0;
      data.headline.forEach((h, i) => {
        const label = i === 2 ? 'First reply, fastest agent' : h.label;
        const want = `${label} ${span(h.p50)} p95 ${span(h.p95)}`;
        checked += 1;
        if (!t.includes(want)) mismatches.push({ claim: `${label} headline`, expected: want, found: t.match(new RegExp(`${label} \\S+ p95 \\S+`))?.[0] ?? 'not printed' });
      });
      const runs = `${data.window.samples.toLocaleString('en-US')} test runs against production, ${data.window.from.slice(0, 10)} to ${data.window.to.slice(0, 10)}`;
      checked += 1;
      if (!t.includes(runs)) mismatches.push({ claim: 'sample count and window', expected: runs, found: t.match(/[\d,]+ test runs against production, [\d-]+ to [\d-]+/)?.[0] ?? 'not printed' });
      return { checked, mismatches };
    },
  },
  {
    id: 'sandbox-hourly-rate',
    source: 'src/data/benchmarks/sandbox.json rate_card.minChargeHourUsd (from https://sandbox.tangle.tools/v1/pricing/sandboxes)',
    async run(page) {
      const data = sandboxRecord();
      if (!data) return { checked: 0, mismatches: [] };
      const want = `$${data.rate_card.minChargeHourUsd.toFixed(3)}`;
      const found = [...text(page.html).matchAll(/sandboxes, from (\$[\d.]+) an hour/g)];
      return { checked: found.length, mismatches: found.filter((m) => m[1] !== want).map((m) => ({ claim: 'sandbox price per hour', expected: `from ${want} an hour`, found: m[0] })) };
    },
  },
  {
    id: 'router-counts',
    source: 'https://router.tangle.tools/models (the public catalog: its model count and distinct providers)',
    async run(page) {
      const scan = [extract(page.html), ...metaDescriptions(page.html)].join('\n');
      const lines = scan.split('\n').filter((l) => /router/i.test(l) || page.site === 'router.tangle.tools');
      const claims = lines.flatMap((l) => [...l.matchAll(/\b(\d[\d,]*)(\+?)\s+(?:AI\s+)?(models|providers)\b/gi)].map((m) => [m[0], m[1], m[2], m[3].toLowerCase()]));
      if (page.site === 'router.tangle.tools') claims.push(...[...scan.matchAll(/\b(Models|Providers)\s+(\d[\d,]*)(\+?)/g)].map((m) => [m[0], m[2], m[3], m[1].toLowerCase()]));
      if (!claims.length) return { checked: 0, mismatches: [] };
      const html = await fetchBody('https://router.tangle.tools/models', 'text');
      const count = /data-testid="model-count"[^>]*>([\d,]+) models/.exec(html ?? '')?.[1];
      if (!count) return { checked: 0, mismatches: [], skipped: 'the router catalog did not answer with a model count' };
      const actual = { models: Number(count.replace(/,/g, '')), providers: new Set([...html.matchAll(/>by ([^<]+)</g)].map((m) => m[1])).size };
      const mismatches = claims.flatMap(([printed, n, plus, kind]) => {
        const stated = Number(n.replace(/,/g, ''));
        return (plus ? stated > actual[kind] : stated !== actual[kind]) ? [{ claim: printed.replace(/\s+/g, ' '), expected: `${actual[kind]} ${kind}`, found: `${stated}${plus} ${kind}` }] : [];
      });
      return { checked: claims.length, mismatches };
    },
  },
  {
    id: 'packages-exist',
    source: 'https://registry.npmjs.org and https://pypi.org (a named @tangle-network package, a pinned version and a pip-installed tangle package must exist)',
    async run(page) {
      const t = extract(page.html);
      const npm = new Map(), pypi = new Set();
      for (const m of t.matchAll(/(@tangle-network\/[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?)(?:@(\d+\.\d+\.\d+(?:-[\w.]+)?))?/g)) {
        if (!npm.has(m[1])) npm.set(m[1], new Set());
        if (m[2]) npm.get(m[1]).add(m[2]);
      }
      for (const m of t.matchAll(/\bpip3? install ((?:-[\w-]+ +)*)([a-z][\w.-]*)/g)) if (/^tangle/i.test(m[2])) pypi.add(m[2].toLowerCase());
      const mismatches = [];
      let checked = 0;
      for (const [name, versions] of npm) {
        checked += 1;
        const doc = await fetchBody(`https://registry.npmjs.org/${name.replace('/', '%2f')}`, 'json');
        if (doc === undefined) { checked -= 1; continue; }
        if (!doc?.versions) { mismatches.push({ claim: `${name} on npm`, expected: 'a published package', found: 'not on the registry' }); continue; }
        for (const v of versions) if (!doc.versions[v]) mismatches.push({ claim: `${name}@${v}`, expected: `latest ${doc['dist-tags']?.latest}`, found: `${v} is not published` });
      }
      for (const name of pypi) {
        checked += 1;
        const doc = await fetchBody(`https://pypi.org/pypi/${name}/json`, 'json');
        if (doc === undefined) checked -= 1;
        else if (!doc?.info) mismatches.push({ claim: `${name} on PyPI`, expected: 'a published package', found: 'not on PyPI' });
      }
      return { checked, mismatches };
    },
  },
  {
    id: 'soc2-wording',
    source: 'wiki/infrastructure-claims-register.md, SOC 2 examination row: examination covering June 14 to September 14, 2026; the report is in issuance',
    async run(page) {
      const t = text(page.html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ''));
      if (!/SOC ?2/i.test(t)) return { checked: 0, mismatches: [] };
      const mismatches = [];
      const over = /SOC ?2[^.]{0,40}\b(certified|certification|compliant|compliance)\b|\b(certified|compliant)\b[^.]{0,25}SOC ?2|\b(achieved|passed|earned|received)\b[^.]{0,25}SOC ?2|SOC ?2[^.]{0,60}\b(report|attestation) (is |was )?(available|issued|completed|published)/i.exec(t);
      if (over) mismatches.push({ claim: over[0], expected: 'examination completed, report in issuance; no certification or issued report', found: over[0] });
      for (const m of t.matchAll(/covering ([A-Z][a-z]+ \d+ to [A-Z][a-z]+ \d+, \d{4})/g)) if (m[1] !== 'June 14 to September 14, 2026') mismatches.push({ claim: m[0], expected: 'June 14 to September 14, 2026', found: m[1] });
      if (page.route === '/security/' && !t.includes('the report is in issuance')) mismatches.push({ claim: '/security SOC 2 status', expected: 'the report is in issuance', found: 'wording missing' });
      return { checked: 1, mismatches };
    },
  },
  {
    id: 'router-markup-not-printed',
    source: 'wiki/decision-2026-10-13-router-markup-openrouter-rate.md (the live value is served at router.tangle.tools/v1/models pricing_policy.markup; pages point there)',
    async run(page) {
      // Markup in a Blueprint example or an operator's own price is not the Router's; only Router pages count.
      if (!page.route.startsWith('/gateway') && !/router\.tangle\.tools|Tangle Router/.test(extract(page.html))) return { checked: 0, mismatches: [] };
      const pct = String.raw`\d+(?:\.\d+)?\s*%`;
      const re = new RegExp(String.raw`\bmark-?up\b[^.\n]{0,80}${pct}|${pct}[^.\n]{0,40}\bmark-?up\b|\b(?:router|gateway)\b[^.\n]{0,80}\b(?:fee|margin|surcharge)\b[^.\n]{0,40}${pct}|${pct}[^.\n]{0,40}\b(?:router|gateway)\b[^.\n]{0,40}\b(?:fee|margin|surcharge)\b`, 'i');
      const hits = extract(page.html).split('\n').flatMap((l) => re.exec(l)?.[0] ?? []);
      return { checked: 1, mismatches: hits.map((h) => ({ claim: h.slice(0, 160), expected: 'no number; point to router.tangle.tools/v1/models pricing_policy.markup', found: 'a markup number is printed' })) };
    },
  },
];

// ---------- run ----------
async function analyse(pages, { voice, outbound, internalOk }) {
  const links = { internal: new Map(), outbound: new Map() };
  const claims = { checked: 0, mismatches: [], skipped: [] };
  const copy = { pages: 0, failures: [], body: [] };
  for (const page of pages) {
    for (const href of hrefs(page.html)) {
      let url;
      try { url = new URL(href, `${page.origin}${page.route}`); } catch { continue; }
      if (!/^https?:$/.test(url.protocol) || url.pathname.startsWith('/cdn-cgi/')) continue;
      url.hash = '';
      const internal = url.origin === page.origin;
      const bucket = internal ? links.internal : links.outbound;
      const key = internal ? `${url.pathname}${url.search}` : url.href;
      if (!bucket.has(key)) bucket.set(key, new Set());
      bucket.get(key).add(page.route);
    }
    for (const claim of CLAIMS) {
      const r = await claim.run(page);
      claims.checked += r.checked;
      if (r.skipped && !claims.skipped.includes(`${claim.id}: ${r.skipped}`)) claims.skipped.push(`${claim.id}: ${r.skipped}`);
      for (const m of r.mismatches) if (!claims.mismatches.some((x) => x.id === claim.id && x.page === page.route && x.claim === m.claim)) claims.mismatches.push({ id: claim.id, site: page.site, page: page.route, source: claim.source, ...m });
    }
    const lint = lintCopy(page.html, { voice });
    copy.pages += 1;
    copy.failures.push(...lint.failures.map((f) => ({ page: page.route, ...f })));
    copy.body.push(...lint.body.map((b) => ({ page: page.route, ...b })));
  }
  const settle = async (bucket, check) => {
    const broken = [], unreachable = [], blocked = [];
    let checked = 0;
    await pool([...bucket], 12, async ([key, from]) => {
      const r = await check(key);
      checked += 1;
      const kind = classify(r);
      const row = { url: key, status: r.status || r.error, from: [...from].sort() };
      if (kind === 'broken') broken.push(row); else if (kind === 'unreachable') unreachable.push(row); else if (kind === 'blocked') blocked.push(row);
    });
    const by = (a, b) => a.url.localeCompare(b.url);
    return { checked, broken: broken.sort(by), unreachable: unreachable.sort(by), blocked: blocked.sort(by) };
  };
  return {
    links: { internal: await settle(links.internal, internalOk), outbound: outbound ? await settle(links.outbound, probe) : { checked: 0, unique: links.outbound.size } },
    claims,
    copy,
  };
}

const copyKey = (site, f) => `${site}|${f.page}|${f.kind}|${f.rule}|${f.text}`;
const arg = (name) => (process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : null);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name.startsWith('_') ? [] : walk(join(dir, e.name))) : e.name.endsWith('.html') ? [join(dir, e.name)] : []));
}

async function distMode(dir, origin) {
  const site = new URL(origin).host;
  const { resolves, redirects } = distResolver(dir, [join(dir, '_redirects'), 'netlify.toml'].filter(existsSync));
  const pages = walk(dir).filter((f) => !/(^|\/)(404|500)\.html$/.test(f)).map((f) => {
    const rel = relative(dir, f).replace(/\\/g, '/');
    const route = rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? `/${rel.slice(0, -11)}/` : `/${rel.replace(/\.html$/, '')}`;
    return { site, origin, route, html: readFileSync(f, 'utf8') };
  });
  const result = await analyse(pages, { voice: site !== 'docs.tangle.tools', outbound: false, internalOk: async (key) => ({ status: resolves(key.split('?')[0]) ? 200 : 404 }) });
  // A redirect that sends readers to a missing page is a broken internal link too.
  for (const [from, to] of redirects) {
    const target = to.replace(/:splat.*$/, '');
    if (!/^https?:/.test(to) && !resolves(target.split('?')[0])) result.links.internal.broken.push({ url: to, status: 404, from: [`redirect ${from}`] });
  }
  const baselineFile = new URL('./public-baseline.json', import.meta.url);
  const baseline = new Set(existsSync(baselineFile) ? JSON.parse(readFileSync(baselineFile, 'utf8')).copy : []);
  const fresh = result.copy.failures.filter((f) => !baseline.has(copyKey(site, f)));
  const problems = [
    ...result.links.internal.broken.map((b) => `broken internal link ${b.url} (on ${b.from.slice(0, 3).join(', ')}${b.from.length > 3 ? `, +${b.from.length - 3}` : ''})`),
    ...result.claims.mismatches.map((m) => `claim mismatch [${m.id}] ${m.page}: "${m.claim}" expected ${m.expected}; found ${m.found}`),
    ...fresh.map((f) => `copy ${f.kind} (${f.rule}) on ${f.page}: "${f.text}"`),
  ];
  console.log(`check-public ${site}: ${pages.length} pages; internal links ${result.links.internal.checked} checked, ${result.links.internal.broken.length} broken; outbound links ${result.links.outbound.unique} (the weekly crawl checks them); claims ${result.claims.checked} checked, ${result.claims.mismatches.length} mismatched; short copy ${result.copy.failures.length} failures (${result.copy.failures.length - fresh.length} baselined); ${result.copy.body.length} body matches`);
  for (const s of result.claims.skipped) console.log(`skipped ${s}`);
  if (arg('--json')) writeFileSync(arg('--json'), JSON.stringify({ site, ...result }, null, 2));
  if (arg('--baseline-out')) writeFileSync(arg('--baseline-out'), `${JSON.stringify({ copy: result.copy.failures.map((f) => copyKey(site, f)).sort() }, null, 2)}\n`);
  if (problems.length) { console.error(`check-public failed:\n- ${problems.join('\n- ')}`); process.exit(1); }
}

async function liveMode() {
  const report = { generatedAt: new Date().toISOString(), sites: {} };
  for (const site of LIVE_SITES) {
    let routes = site.routes;
    if (!routes) {
      const xml = await fetchBody(`${site.origin}${site.sitemap}`, 'text');
      routes = [...(xml ?? '').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
      if (!routes.length) { report.sites[site.name] = { error: `sitemap ${site.origin}${site.sitemap} unreadable` }; continue; }
    }
    const pages = [], pageErrors = [];
    await pool(routes, 8, async (route) => {
      const res = await fetch(`${site.origin}${route}`, { headers: { 'user-agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(30000) }).catch(() => null);
      if (res?.ok) pages.push({ site: site.name, origin: site.origin, route, html: await res.text() });
      else pageErrors.push({ route, status: res?.status ?? 'unreachable' });
    });
    const result = await analyse(pages.sort((a, b) => a.route.localeCompare(b.route)), { voice: site.name !== 'docs.tangle.tools', outbound: true, internalOk: (key) => probe(`${site.origin}${key}`) });
    const bodyByRule = {};
    for (const b of result.copy.body) bodyByRule[b.rule] = (bodyByRule[b.rule] ?? 0) + 1;
    const n = { pages: pages.length, pageErrors, ...result, copy: { pages: result.copy.pages, failures: result.copy.failures, bodyMatches: result.copy.body.length, bodyByRule, body: result.copy.body } };
    report.sites[site.name] = n;
    console.log(`${site.name}: ${n.pages} pages, internal broken ${n.links.internal.broken.length}/${n.links.internal.checked}, outbound broken ${n.links.outbound.broken.length}/${n.links.outbound.checked}, claim mismatches ${n.claims.mismatches.length}, copy failures ${n.copy.failures.length}, body matches ${n.copy.bodyMatches}`);
  }
  if (arg('--out')) writeFileSync(arg('--out'), JSON.stringify(report, null, 2));
  if (arg('--md')) writeFileSync(arg('--md'), markdown(report));
}

function markdown(report) {
  const out = [];
  let drift = 0;
  const from = (b) => `linked from ${b.from.slice(0, 5).join(', ')}${b.from.length > 5 ? `, +${b.from.length - 5} more` : ''}`;
  for (const [name, s] of Object.entries(report.sites)) {
    if (s.error) { out.push(`## ${name}`, `Crawl failed: ${s.error}`, ''); drift += 1; continue; }
    const rows = [
      ...s.pageErrors.map((p) => `- page ${p.route} answered ${p.status}`),
      ...s.links.internal.broken.map((b) => `- internal link ${b.url} answers ${b.status}; ${from(b)}`),
      ...s.links.outbound.broken.map((b) => `- outbound link ${b.url} answers ${b.status}; ${from(b)}`),
      ...s.claims.mismatches.map((m) => `- claim [${m.id}] ${m.page}: "${m.claim}" expected ${m.expected}, found ${m.found}. Source: ${m.source}`),
      ...s.copy.failures.map((f) => `- copy ${f.kind} (${f.rule}) on ${f.page}: "${f.text}"`),
    ];
    drift += rows.length;
    out.push(`## ${name}`, `${s.pages} pages. Internal links ${s.links.internal.checked} checked, ${s.links.internal.broken.length} broken. Outbound links ${s.links.outbound.checked} checked, ${s.links.outbound.broken.length} broken, ${s.links.outbound.unreachable.length} unreachable, ${s.links.outbound.blocked.length} blocked. Claims ${s.claims.checked} checked, ${s.claims.mismatches.length} mismatched. Short-copy failures ${s.copy.failures.length}. Body matches (reported, not failures) ${s.copy.bodyMatches}.`, ...rows, '');
  }
  return [`<!-- drift:${drift} -->`, `Weekly crawl of the public sites, ${report.generatedAt.slice(0, 10)}, by scripts/check-public.mjs. Each run rewrites this issue; it closes when every list below is empty.`, '', ...out].join('\n');
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const [mode, dir, origin] = process.argv.slice(2);
  if (mode === 'dist' && dir && origin) await distMode(dir, origin);
  else if (mode === 'live') await liveMode();
  else { console.error('usage: check-public.mjs dist <dir> <origin> | live [--out f.json] [--md f.md]'); process.exit(2); }
}

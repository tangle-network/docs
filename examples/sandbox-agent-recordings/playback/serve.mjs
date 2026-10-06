import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat, realpath } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, sep } from 'node:path'

const root = fileURLToPath(new URL('.', import.meta.url))
const port = Number(process.env.PORT ?? 4393)
const fixed = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/player.mjs', ['player.mjs', 'text/javascript; charset=utf-8']],
  ['/manifest.json', ['manifest.json', 'application/json']],
  ['/vendor/asciinema-player.min.js', ['vendor/package/dist/bundle/asciinema-player.min.js', 'text/javascript; charset=utf-8']],
  ['/vendor/asciinema-player.css', ['vendor/package/dist/bundle/asciinema-player.css', 'text/css; charset=utf-8']],
  ['/recordings/headless-clean/terminal-task-only-from-9.3s-1x.mp4', ['recordings/headless-clean/terminal-task-only-from-9.3s-1x.mp4', 'video/mp4']],
  ['/recordings/headless-clean/terminal-task-only-from-9.3s-1x.gif', ['recordings/headless-clean/terminal-task-only-from-9.3s-1x.gif', 'image/gif']],
  ['/recordings/headless-clean/task-only-excerpt-receipt.json', ['recordings/headless-clean/task-only-excerpt-receipt.json', 'application/json']],
  ['/recordings/headless-clean/reproduce.zip', ['recordings/headless-clean/reproduce.zip', 'application/zip']],
])
createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return }
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname
  let target = fixed.get(pathname)
  if (!target && /^\/recordings\/[a-z0-9][a-z0-9-]*\/(original\.cast|terminal-[124]x\.(mp4|gif)|report\.html|change\.patch|tests\.txt|acceptance\.json)$/.test(pathname)) {
    const type = pathname.endsWith('.mp4') ? 'video/mp4' : pathname.endsWith('.gif') ? 'image/gif' : pathname.endsWith('.html') ? 'text/html; charset=utf-8' : pathname.endsWith('.json') ? 'application/json' : 'text/plain; charset=utf-8'
    target = [pathname.slice(1), type]
  }
  if (!target) { response.writeHead(404).end(); return }
  const filename = resolve(root, target[0])
  const actual = await realpath(filename).catch(() => null)
  if (!actual?.startsWith(root.endsWith(sep) ? root : root + sep)) { response.writeHead(404).end(); return }
  const info = await stat(actual)
  const headers = { 'Content-Type': target[1], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' }
  const match = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/)
  let start = 0
  let end = info.size - 1
  let status = 200
  if (match) {
    start = Number(match[1]); end = match[2] ? Number(match[2]) : end
    if (start > end || end >= info.size) { response.writeHead(416).end(); return }
    status = 206
    headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`
  }
  headers['Content-Length'] = end - start + 1
  response.writeHead(status, headers)
  if (request.method === 'HEAD') response.end()
  else createReadStream(actual, { start, end }).pipe(response)
}).listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}`))

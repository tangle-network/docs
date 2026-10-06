import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { inspectCast } from './cast.mjs'

const [source, name, title, note = ''] = process.argv.slice(2)
if (!source || !name || !title || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  throw new Error('Usage: node prepare.mjs /absolute/recording.cast recording-name "Title" "Optional factual note"')
}
const root = fileURLToPath(new URL('.', import.meta.url))
const bytes = readFileSync(source)
const { summary } = inspectCast(bytes)
const destination = resolve(root, 'recordings', name)
mkdirSync(destination, { recursive: true })
const original = resolve(destination, 'original.cast')
if (existsSync(original)) {
  const existing = inspectCast(readFileSync(original)).summary
  if (existing.sha256 !== summary.sha256) throw new Error('This name already belongs to another recording. Use a new name.')
} else {
  copyFileSync(source, original)
}
const manifestPath = resolve(root, 'manifest.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const recording = { name, title, note, ...summary, cast: `recordings/${name}/original.cast` }
const remaining = manifest.filter(item => item.name !== name)
writeFileSync(manifestPath, `${JSON.stringify([...remaining, recording], null, 2)}\n`)
writeFileSync(resolve(destination, 'source.json'), `${JSON.stringify({ source: resolve(source), importedAt: new Date().toISOString(), ...summary }, null, 2)}\n`)
console.log(JSON.stringify(recording, null, 2))

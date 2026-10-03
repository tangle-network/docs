import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { inspectCast } from './cast.mjs'

const [source, outputDirectory, speedArgument = '1'] = process.argv.slice(2)
const speed = Number(speedArgument)
if (!source || !outputDirectory || ![1, 2, 4].includes(speed)) {
  throw new Error('Usage: node export.mjs /absolute/recording.cast output-directory [1|2|4]')
}
const root = fileURLToPath(new URL('.', import.meta.url))
const { summary } = inspectCast(readFileSync(source))
const output = resolve(outputDirectory)
mkdirSync(output, { recursive: true })
const gif = resolve(output, `terminal-${speed}x.gif`)
const mp4 = resolve(output, `terminal-${speed}x.mp4`)
if (existsSync(gif) || existsSync(mp4)) throw new Error('Exports already exist; choose a new output directory')
const execute = (command, args) => {
  const result = spawnSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  if (result.error || result.status !== 0) throw new Error(result.error?.message ?? result.stderr ?? `${command} failed`)
  return result.stdout.trim()
}
// Preserve every pause. AGG otherwise defaults to shortening idle gaps to five seconds.
const aggArgs = ['--quiet', '--no-loop', '--font-size', '18', '--line-height', '1.35', '--speed', String(speed), '--idle-time-limit', String(Math.max(summary.durationSeconds + 1, 3600)), '--last-frame-duration', '2', resolve(source), gif]
execute(resolve(root, 'bin/agg'), aggArgs)
execute('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-n', '-i', gif, '-an', '-vf', 'fps=30,pad=ceil(iw/2)*2:ceil(ih/2)*2', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4])
const video = JSON.parse(execute('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name,width,height', '-of', 'json', mp4]))
const timing = { originalSeconds: summary.durationSeconds, playbackSpeed: speed, idleGapsRemoved: false, finalFrameHoldSeconds: 2, videoSeconds: Number(video.format.duration) }
if (Math.abs(timing.videoSeconds - (summary.durationSeconds / speed + 2)) > 0.5) {
  throw new Error(`Export timing does not match the source: ${JSON.stringify(timing)}`)
}
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex')
const receipt = {
  source: resolve(source),
  sourceSha256: summary.sha256,
  renderer: execute(resolve(root, 'bin/agg'), ['--version']),
  aggArgs,
  ...timing,
  gif: { path: gif, sha256: hash(gif) },
  mp4: { path: mp4, sha256: hash(mp4), ...video },
}
writeFileSync(resolve(output, `export-${speed}x.json`), `${JSON.stringify(receipt, null, 2)}\n`)
console.log(JSON.stringify(receipt, null, 2))

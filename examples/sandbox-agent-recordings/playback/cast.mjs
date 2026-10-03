import { createHash } from 'node:crypto'

export function inspectCast(bytes) {
  const lines = bytes.toString('utf8').split(/\r?\n/).filter(line => line.trim())
  const header = JSON.parse(lines.shift() ?? 'null')
  if (header?.version !== 2 || !Number.isInteger(header.width) || !Number.isInteger(header.height) || header.width < 1 || header.height < 1) {
    throw new Error('Expected an asciicast v2 header with terminal dimensions')
  }
  const events = lines.map(line => JSON.parse(line))
  let previous = 0
  let outputBytes = 0
  let outputEvents = 0
  for (const event of events) {
    if (!Array.isArray(event) || event.length !== 3 || !Number.isFinite(event[0]) || event[0] < previous || !['o', 'i', 'r', 'm'].includes(event[1]) || typeof event[2] !== 'string') {
      throw new Error('Invalid or out-of-order asciicast event')
    }
    previous = event[0]
    if (event[1] === 'o') {
      outputBytes += Buffer.byteLength(event[2])
      outputEvents += 1
    }
    if (event[1] === 'r' && !/^\d+x\d+$/.test(event[2])) throw new Error('Invalid terminal resize event')
  }
  if (outputBytes === 0) throw new Error('The recording contains no terminal output')
  return {
    header,
    events,
    summary: {
      sha256: createHash('sha256').update(bytes).digest('hex'),
      cols: header.width,
      rows: header.height,
      durationSeconds: previous,
      outputBytes,
      outputEvents,
      eventCount: events.length,
    },
  }
}

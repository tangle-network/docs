const recordings = await fetch('/manifest.json', { cache: 'no-store' }).then(response => response.json())
const element = id => document.getElementById(id)
const speed = element('speed')
let selected
let player
let playing = false
let generation = 0

async function mount(position = 0, autoplay = false) {
  generation += 1
  const ownGeneration = generation
  player?.dispose()
  playing = autoplay
  player = AsciinemaPlayer.create(`/${selected.cast}`, element('player'), {
    cols: selected.cols,
    rows: selected.rows,
    startAt: position,
    speed: Number(speed.value),
    // Never hide elapsed time by compressing gaps.
    idleTimeLimit: Math.max(selected.durationSeconds + 1, 3600),
    preload: true,
    poster: selected.posterAt === undefined ? undefined : `npt:${selected.posterAt}`,
    autoplay,
    controls: true,
    fit: 'width',
    terminalFontFamily: 'Menlo, Monaco, monospace',
    terminalLineHeight: 1.35,
  })
  for (const event of ['playing', 'pause', 'ended']) {
    player.addEventListener(event, () => {
      if (generation === ownGeneration) playing = event === 'playing'
    })
  }
}

async function choose(name) {
  selected = recordings.find(recording => recording.name === name)
  element('title').textContent = selected.title
  element('note').textContent = selected.note
  element('recording').value = name
  element('original').href = `/${selected.cast}`
  const archive = `/recordings/${selected.name}/reproduce.zip`
  element('reproduce').hidden = !(await fetch(archive, { method: 'HEAD' })).ok
  element('reproduce').href = archive
  element('result').hidden = !selected.result
  if (selected.result) element('result').href = `/${selected.result}`
  for (const extension of ['mp4', 'gif']) {
    const url = `/recordings/${selected.name}/terminal-1x.${extension}`
    const response = await fetch(url, { method: 'HEAD' })
    element(extension).hidden = !response.ok
    element(extension).href = url
  }
  element('error').hidden = true
  element('terminal').hidden = false
  element('controls').hidden = false
  await mount()
}

if (recordings.length) {
  for (const recording of recordings) {
    element('recording').add(new Option(recording.title, recording.name))
  }
  element('recording').hidden = recordings.length < 2
  const requested = new URLSearchParams(location.search).get('recording')
  await choose(recordings.some(recording => recording.name === requested) ? requested : recordings[0].name)
} else {
  element('error').textContent = 'No recordings have been added.'
}

element('recording').addEventListener('change', event => choose(event.target.value))
speed.addEventListener('change', () => mount(player.getCurrentTime(), playing))

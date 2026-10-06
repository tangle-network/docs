# Replay the headless SDK capture

This player replays custom stdout from `headless.ts`.
It is not a native Claude Code TUI recording.
The visible page identifies that distinction before playback.

Install the maintained player bundle:

```sh
mkdir -p vendor
npm pack asciinema-player@3.17.0 --pack-destination vendor
shasum -a 256 vendor/asciinema-player-3.17.0.tgz
```

Compare the digest with `../evidence/vendor.json` before extracting.
The retained npm tarball was verified against official package integrity metadata.

```sh
tar -xzf vendor/asciinema-player-3.17.0.tgz -C vendor
node serve.mjs
```

Open <http://127.0.0.1:4393/?recording=headless-clean>.
The localhost server allows only named player assets, recordings, and reports.
It does not serve raw events or credentials.

The original capture is `recordings/headless-clean/original.cast`.
Its SHA-256 is `0404ba5fe12e5d3522fdbaac6434ff2b50d88218c2d85af27c842d95bf6af373`.
Duration is 40.242357542 seconds, including provisioning before the first output at 9.374 seconds.
Original timestamps and pauses remain intact.
The player allows explicitly selected 2× and 4× playback.

`prepare.mjs` imports another asciicast without overwriting an existing different capture.
Supply a truthful title and mode description:

```sh
node prepare.mjs /absolute/path/capture.cast example 'Headless SDK run' 'Custom rendering of headless SDK events.'
```

`export.mjs` requires an official AGG 1.9.0 binary at `bin/agg`, plus FFmpeg and ffprobe on PATH.
It exports GIF and H.264 MP4, preserves pauses, and appends a two-second final hold.
It refuses to overwrite existing exports and checks duration against source timing.

```sh
node export.mjs recordings/headless-clean/original.cast recordings/headless-clean 1
```

Binaries, package downloads, and exported media are excluded from Git.
The original media's hashes and excerpt boundaries are retained under `../evidence/`.

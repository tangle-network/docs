import codecs
import errno
import fcntl
import json
import os
import pathlib
import pty
import struct
import sys
import termios
import time

root = pathlib.Path(__file__).resolve().parent
name = sys.argv[1] if len(sys.argv) > 1 else 'headless-recording'
if not name or any(char not in 'abcdefghijklmnopqrstuvwxyz0123456789-' for char in name):
    raise SystemExit('Use a lowercase recording name with digits and hyphens')
proof = root / 'proof' / name
proof.mkdir(parents=True, exist_ok=True)
cast = proof / 'headless.cast'
if cast.exists():
    raise SystemExit('Recording already exists; refusing an accidental second attempt')
start = time.monotonic()
secret = os.environ.get('TANGLE_API_KEY', '')
decoder = codecs.getincrementaldecoder('utf-8')('replace')
pid, fd = pty.fork()
if pid == 0:
    os.chdir(root)
    os.execvp('node', ['node', '--experimental-strip-types', 'run-headless.ts'])
fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack('HHHH', 34, 110, 0, 0))
header = {'version': 2, 'width': 110, 'height': 34, 'timestamp': int(time.time()), 'title': 'Headless SDK run — custom event output'}
with cast.open('x') as recording, (proof / 'headless.txt').open('x') as transcript:
    recording.write(json.dumps(header) + '\n')
    while True:
        try:
            data = os.read(fd, 65536)
        except OSError as error:
            if error.errno == errno.EIO:
                break
            raise
        if not data:
            break
        text = decoder.decode(data)
        if secret:
            text = text.replace(secret, '[REDACTED]')
        if text:
            recording.write(json.dumps([time.monotonic() - start, 'o', text]) + '\n')
            recording.flush()
            transcript.write(text)
            transcript.flush()
            sys.stdout.write(text)
            sys.stdout.flush()
_, status = os.waitpid(pid, 0)
code = os.waitstatus_to_exitcode(status)
(proof / 'recording.json').write_text(json.dumps({'exitCode': code, 'durationSeconds': time.monotonic() - start, 'source': 'Actual child PTY stdout/stderr, captured at original speed', 'sandboxId': os.environ.get('TANGLE_SANDBOX_ID')}, indent=2) + '\n')
raise SystemExit(code)

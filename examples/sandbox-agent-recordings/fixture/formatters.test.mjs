import assert from 'node:assert/strict'
import test from 'node:test'
import { formatBytes, formatUptime } from './formatters.ts'

for (const [label, value] of [
  ['NaN', Number.NaN],
  ['positive infinity', Number.POSITIVE_INFINITY],
  ['negative infinity', Number.NEGATIVE_INFINITY],
]) {
  test(`unavailable uptime (${label}) renders as 0s`, () => {
    assert.equal(formatUptime(value), '0s')
  })
}

for (const [input, expected] of [
  [-1, '0s'],
  [-86_400_000, '0s'],
  [0, '0s'],
  [999, '0s'],
  [1_000, '1s'],
  [59_999, '59s'],
  [60_000, '1m 0s'],
  [61_001, '1m 1s'],
  [3_599_999, '59m 59s'],
  [3_600_000, '1h 0m'],
  [3_660_000, '1h 1m'],
  [86_399_999, '23h 59m'],
  [86_400_000, '1d 0h'],
  [176_400_000, '2d 1h'],
]) {
  test(`uptime ${input} ms remains ${expected}`, () => {
    assert.equal(formatUptime(input), expected)
  })
}

test('existing byte formatter behavior remains intact', () => {
  assert.equal(formatBytes(Number.NaN), '0 B')
  assert.equal(formatBytes(1024), '1.0 KB')
  assert.equal(formatBytes(10 * 1024 * 1024), '10 MB')
})

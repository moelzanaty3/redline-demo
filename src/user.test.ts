import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseUser } from './user.js'

test('a valid payload becomes a User', () => {
  assert.deepEqual(parseUser('{"id":"u1","name":"Ada"}'), { id: 'u1', name: 'Ada' })
})

test('a payload missing a field is refused', () => {
  assert.throws(() => parseUser('{"id":"u1"}'), /not a User/)
})

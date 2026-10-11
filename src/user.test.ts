import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadUser } from './user.js'

test('a valid payload becomes a User', () => {
  assert.deepEqual(loadUser('{"id":"u1","name":"Ada"}'), { id: 'u1', name: 'Ada' })
})

test('a payload missing a field is refused', () => {
  assert.throws(() => loadUser('{"id":"u1"}'), /not a User/)
})

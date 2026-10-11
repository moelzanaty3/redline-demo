import { test } from 'node:test'
import assert from 'node:assert/strict'
import { UserDirectory } from './users.js'

test('a user that was added can be found', () => {
  const directory = new UserDirectory()
  directory.add({ id: 'u1', name: 'Ada', email: 'ada@example.com' })
  assert.equal(directory.find('u1')?.name, 'Ada')
})

test('the same id cannot be added twice', () => {
  const directory = new UserDirectory()
  directory.add({ id: 'u1', name: 'Ada', email: 'ada@example.com' })
  assert.throws(() => directory.add({ id: 'u1', name: 'Grace', email: 'grace@example.com' }))
})

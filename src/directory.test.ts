import assert from 'node:assert/strict'
import { test } from 'node:test'
import { countriesByInitial } from './directory.js'

test('countries are grouped under the first letter of their name', () => {
  const groups = countriesByInitial()
  assert.ok(groups['E']?.some((country) => country.code === 'EG'))
  assert.equal(Object.values(groups).flat().length, 249)
})

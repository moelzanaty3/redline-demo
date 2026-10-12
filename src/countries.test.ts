import assert from 'node:assert/strict'
import { test } from 'node:test'
import { COUNTRIES, findCountry } from './countries.js'

test('the list has every ISO 3166-1 alpha-2 code once', () => {
  assert.equal(COUNTRIES.length, 249)
  assert.equal(new Set(COUNTRIES.map((country) => country.code)).size, 249)
})

test('a code is found whatever its case', () => {
  assert.deepEqual(findCountry('eg'), { code: 'EG', name: 'Egypt' })
})

test('an unknown or retired code is not a country', () => {
  assert.equal(findCountry('ZZ'), undefined)
  assert.equal(findCountry('SU'), undefined)
})

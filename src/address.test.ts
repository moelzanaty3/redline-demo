import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseAddress } from './address.js'

test('an address with a known country is parsed', () => {
  const address = parseAddress(
    JSON.stringify({ line1: '1 Nile St', city: 'Cairo', postcode: '11511', country: 'eg' })
  )
  assert.equal(address.country.name, 'Egypt')
  assert.equal(address.line2, undefined)
})

test('an unknown country code is refused', () => {
  assert.throws(
    () => parseAddress(JSON.stringify({ line1: 'x', city: 'y', postcode: 'z', country: 'SU' })),
    /unknown country code: SU/
  )
})

test('a payload missing a field is refused', () => {
  assert.throws(() => parseAddress(JSON.stringify({ line1: 'x' })), /not an address/)
})

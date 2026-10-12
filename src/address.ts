import { findCountry, type Country } from './countries.js'

export type Address = {
  line1: string
  line2?: string
  city: string
  postcode: string
  country: Country
}

type AddressInput = {
  line1: string
  line2?: string
  city: string
  postcode: string
  country: string
}

function isAddressInput(value: unknown): value is AddressInput {
  return (
    typeof value === 'object' &&
    value !== null &&
    'line1' in value &&
    typeof value.line1 === 'string' &&
    (!('line2' in value) || typeof value.line2 === 'string') &&
    'city' in value &&
    typeof value.city === 'string' &&
    'postcode' in value &&
    typeof value.postcode === 'string' &&
    'country' in value &&
    typeof value.country === 'string'
  )
}

export function parseAddress(raw: string): Address {
  const parsed: unknown = JSON.parse(raw)
  if (!isAddressInput(parsed)) throw new Error('payload is not an address')

  const country = findCountry(parsed.country)
  if (country === undefined) throw new Error(`unknown country code: ${parsed.country}`)

  const address: Address = {
    line1: parsed.line1,
    city: parsed.city,
    postcode: parsed.postcode,
    country,
  }
  if (parsed.line2 !== undefined) address.line2 = parsed.line2
  return address
}

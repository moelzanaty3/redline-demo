import groupBy from 'lodash/groupBy.js'
import { COUNTRIES, type Country } from './countries.js'

export function countriesByInitial(): Record<string, Country[]> {
  return groupBy(COUNTRIES, (country) => country.name.charAt(0))
}

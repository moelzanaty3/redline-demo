# 0001 · The country list lives in code

**Status:** accepted · **Date:** 2026-10-12 · **Pull request:** [#5](https://github.com/moelzanaty3/redline-demo/pull/5)

## Context

`parseAddress` has to refuse an address whose country does not exist. That needs the list of ISO 3166-1 alpha-2 codes, and the list has to come from somewhere.

## Options

1. **A dependency** such as `i18n-iso-countries`. Maintained by someone else, but it brings data for every language when we need one, and every upgrade is a supply-chain change to review.
2. **A lookup service** at request time. Always current, but parsing an address would need the network, and a slow or failing call would stop every parse.
3. **A table in code**, generated once from the Unicode CLDR data that ships with Node (`Intl.DisplayNames`).

## Decision

Option 3. `src/countries.ts` holds 249 entries, with codes Node reports as deprecated (`SU`, `YU`, `BU`, …) and CLDR's non-country regions (`EU`, `UN`, `XK`, …) left out. A test pins the count at 249.

## Consequences

- No new dependency and no network call. Parsing stays synchronous.
- ISO 3166 changes a few times a decade. When it does, someone regenerates the table and the count test fails until it's updated on purpose.
- The table is 260 lines. That's why this change crossed the 300-line threshold that asks for an ADR.

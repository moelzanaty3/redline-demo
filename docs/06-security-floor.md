# 06 · The security floor

**Tag:** `step-06` · **Pull request:** [#6](https://github.com/moelzanaty3/redline-demo/pull/6)

Every check so far failed softly: at `observe`, the gate reports a broken rule and still passes. Two checks never work that way. **Dependency review** and the **secret scan** are the security floor. They fail the gate at every rung, and no label waives them.

## The change

`countriesByInitial` in `src/directory.ts` groups the country table with lodash:

```ts
import groupBy from 'lodash/groupBy.js'
import { COUNTRIES, type Country } from './countries.js'

export function countriesByInitial(): Record<string, Country[]> {
  return groupBy(COUNTRIES, (country) => country.name.charAt(0))
}
```

The first commit pins an old version, the way a copied snippet or an old lockfile does:

```bash
pnpm add lodash@4.17.20 --save-exact
pnpm add -D @types/lodash
```

The tests pass. Nothing about the code is wrong. The version is.

## The pipeline

```
package.json » lodash@4.17.20 – Command Injection in lodash (high severity)
  ↪ https://github.com/advisories/GHSA-35jh-r3h4-6jhm
package.json » lodash@4.17.20 – lodash vulnerable to Code Injection via `_.template` imports key names (high severity)
  ↪ https://github.com/advisories/GHSA-r5fr-rjxr-66jc
Error: Dependency review detected vulnerable packages.
```

| Check | Result |
|---|---|
| **Dependency review** | ❌ two HIGH advisories |
| **`gate`** | ❌ `Redline gate failed on security checks (not label-exemptible, and not on the enforcement ladder): dependency-review` |
| Everything else | ✅ |

Compare step 02, where **Deterministic policy** failed and the gate passed. The rung (`observe`) is the same, but the result is the opposite.

`fail-on-dependency-severity: high` in `.github/workflows/redline.yml` sets the threshold. Moderate advisories are reported without failing.

## A label doesn't help

[#6](https://github.com/moelzanaty3/redline-demo/pull/6) was given the `redline-exempt` label to try:

```
Soft-fail label present: redline-exempt
Error: Redline gate failed on security checks (not label-exemptible, and not on the enforcement ladder): dependency-review
```

The label is seen and ignored. Exemptions, covered in step 08, apply to process checks only.

## The fix

Upgrade to a version past both advisories:

```bash
pnpm add lodash@4.18.1 --save-exact
pnpm test
```

Every check is green. Deleting the dependency would also have fixed it: `Object.groupBy` (Node 21+) does the same job without one.

## Check it

```bash
git checkout step-06
pnpm install
pnpm test
```

## The other half: the secret scan

**Secret scan (diff)** runs trufflehog over the commits in the pull request and works the same way: it fails at every rung, and no label waives it. GitHub's push protection, switched on by `init` in step 01, usually stops a recognised token before it's even pushed. This walkthrough doesn't commit a fake secret to show it, because a demo credential in a public repository's history stays there.

**Next:** `git checkout step-07`, then read `docs/07-blocking.md`.

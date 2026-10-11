# 00 · The starting point

**Tag:** `step-00`

This is a repository before Redline: a small TypeScript service with tests and a CI workflow. Every later step changes it in one way you can see.

## What's here

| Path | What it is |
|---|---|
| `src/users.ts` | A `UserDirectory` that adds and finds users |
| `src/users.test.ts` | Two tests, using Node's built-in test runner |
| `tsconfig.json` | Strict TypeScript, including `noUncheckedIndexedAccess` |
| `.github/workflows/ci.yml` | Installs with pnpm and runs the tests on every push and pull request |

## Run it

```bash
git checkout step-00
pnpm install
pnpm test
```

```
✔ a user that was added can be found
✔ the same id cannot be added twice
ℹ pass 2
ℹ fail 0
```

## Why this matters for the next step

CI here runs the tests and nothing else. Nothing checks how the code is written, and nothing tells an AI assistant what this team expects. Step 01 adds both.

**Next:** `git checkout step-01`, then read `docs/01-onboard.md`.

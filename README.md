# redline-demo

A small TypeScript service for learning [Redline](https://redline-gate.vercel.app) one step at a time.

Every step is one commit on `main`, tagged `step-NN`. Steps that involve CI happen as pull requests, which stay open so you can read what the pipeline reported. Each step has a page in [`docs/`](docs/README.md) that explains what changed, the command that changed it, and what to look at.

## Follow along

```bash
git clone https://github.com/moelzanaty3/redline-demo.git
cd redline-demo
git checkout step-00
pnpm install
pnpm test
```

Move to any step with `git checkout step-NN`, then read that step's page.

## Steps

| Step | Tag | Pull request | What you see |
|---|---|---|---|
| [00 · The starting point](docs/00-the-starting-point.md) | `step-00` | | A TypeScript service with tests and CI, before Redline |
| [01 · Onboard with Redline](docs/01-onboard.md) | `step-01` | [#1](https://github.com/moelzanaty3/redline-demo/pull/1) | One command adds the rules, the review commands and a merge gate |

## What you need

- [Node](https://nodejs.org) 18.11 or later (CI uses 22)
- [pnpm](https://pnpm.io/installation)
- [git](https://git-scm.com/downloads)

You don't need to install Redline. Every command runs it with `npx redlinegate@latest`.

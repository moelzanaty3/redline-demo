# redline-demo

A small TypeScript service for learning [Redline](https://redline-gate.vercel.app) one step at a time.

Every step is one commit on `main`, tagged `step-NN`. Steps that involve CI were built as pull requests; open the linked pull request to read what the pipeline reported. Each step has a page in [`docs/`](docs/README.md) that explains what changed, the command that changed it, and what to look at.

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
| [02 · Your first finding](docs/02-first-finding.md) | `step-02` | [#2](https://github.com/moelzanaty3/redline-demo/pull/2) | Four broken rules, found on your machine and in the pipeline |
| [03 · Explain and fix](docs/03-explain-and-fix.md) | `step-03` | [#3](https://github.com/moelzanaty3/redline-demo/pull/3) | `explain` a rule, fix the code properly, and every check goes green |

## What you need

- [Node](https://nodejs.org) 18.11 or later (CI uses 22)
- [pnpm](https://pnpm.io/installation)
- [git](https://git-scm.com/downloads)

You don't need to install Redline. Every command runs it with `npx redlinegate@latest`.

## How each step was built

The exact commands, in order, so you can rebuild this repository yourself. Files written by hand are listed by name, and their contents are in the step's commit.

### step-00 · The starting point

```bash
mkdir redline-demo && cd redline-demo
git init -b main
# written by hand: package.json, tsconfig.json, .gitignore, src/users.ts,
#                  src/users.test.ts, .github/workflows/ci.yml, README.md, docs/
pnpm install
pnpm test
git add -A
git commit -m "chore: a TypeScript service with tests and CI, before Redline"
git remote add origin git@github.com:moelzanaty3/redline-demo.git
git push -u origin main
git tag -a step-00 -m "Step 00: the starting point"
git push origin step-00
```

### step-01 · Onboard with Redline

```bash
npx redlinegate@latest init --gate-source local
# init wrote 21 files, applied the GitHub settings, committed on the branch
# redline/onboard, pushed it and opened pull request #1 itself.
git checkout redline/onboard
# written by hand: docs/01-onboard.md, a row in the README and docs/README.md tables
git add docs README.md
git commit -m "docs: step 01, onboard with Redline"
git push origin redline/onboard
git tag -a step-01 -m "Step 01: onboard with Redline"
git push origin step-01
```

### step-02 · Your first finding

```bash
git checkout -b step/02-first-finding redline/onboard
# written by hand: src/user.ts (the four broken rules)
pnpm test
git add src/user.ts
git commit -m "feat: load a user from JSON (breaks four Redline rules on purpose)"
git push -u origin step/02-first-finding
gh pr create --base redline/onboard --head step/02-first-finding --title "Step 02 · Your first finding"
npx redlinegate@latest review --base redline/onboard
# written by hand: docs/02-first-finding.md, README and docs/README.md rows, this entry
git add docs README.md
git commit -m "docs: step 02, your first finding"
git push
git tag -a step-02 -m "Step 02: your first finding"
git push origin step-02
```

### step-03 · Explain and fix

```bash
git checkout -b step/03-explain-and-fix step/02-first-finding
npx redlinegate@latest explain core/unsafe-assertion
# written by hand: src/user.ts (type predicate instead of assertions), src/user.test.ts
pnpm test
git add src
npx redlinegate@latest review --base redline/onboard --staged
git commit -m "fix: parse the payload into a User instead of asserting it"
git push -u origin step/03-explain-and-fix
gh pr create --base step/02-first-finding --head step/03-explain-and-fix --title "Step 03 · Explain and fix"
# written by hand: docs/03-explain-and-fix.md, README and docs/README.md rows, this entry
git add docs README.md
git commit -m "docs: step 03, explain and fix"
git push
git tag -a step-03 -m "Step 03: explain and fix"
git push origin step-03
```

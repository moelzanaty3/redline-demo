# redline-demo

A small TypeScript service for learning [Redline](https://redline-gate.vercel.app) one step at a time.

Every step is one entry in `main`'s first-parent history, tagged `step-NN`:

```bash
git log --first-parent --oneline main
```

Each step was built as a pull request; open the linked pull request to read what the pipeline reported. Steps 02–06 were merged into `main` through landing pull requests (#7–#11), but their checks and history live on the pull requests linked below. Each step has a page in [`docs/`](docs/README.md) that explains what changed, the command that changed it, and what to look at.

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
| [04 · A team rule](docs/04-team-rule.md) | `step-04` | [#4](https://github.com/moelzanaty3/redline-demo/pull/4) | Your team's own rule, in every assistant and in the review |
| [05 · A big change needs an ADR](docs/05-adr.md) | `step-05` | [#5](https://github.com/moelzanaty3/redline-demo/pull/5) | Past 300 lines, the ADR check fails until a decision record is linked |
| [06 · The security floor](docs/06-security-floor.md) | `step-06` | [#6](https://github.com/moelzanaty3/redline-demo/pull/6) | A vulnerable dependency fails the gate at every rung, and no label waives it |
| [07 · Make the gate a required check](docs/07-blocking.md) | `step-07` | [#12](https://github.com/moelzanaty3/redline-demo/pull/12) | `init --blocking`: a red gate now disables the merge button |
| [08 · Exemptions](docs/08-exemption.md) | `step-08` | [#14](https://github.com/moelzanaty3/redline-demo/pull/14) | Merge past a failing process check on the record: a reason, an expiry and a scope |
| [09 · Earn a stricter rung](docs/09-earn-a-rung.md) | `step-09` | [#15](https://github.com/moelzanaty3/redline-demo/pull/15), [#16](https://github.com/moelzanaty3/redline-demo/pull/16) | Record evidence, and watch `block-blocker` be refused until it is earned |

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

### step-04 · A team rule

```bash
git checkout -b step/04-team-rule step/03-explain-and-fix
# written by hand: .redline/local.md
npx redlinegate@latest init --no-commit
pnpm test
git add -A
git commit -m "feat: a team rule, errors are returned not logged"
git push -u origin step/04-team-rule
npx redlinegate@latest review --print-prompt | grep no-console
# written by hand: docs/04-team-rule.md, README and docs/README.md rows, this entry
git add docs README.md
git commit -m "docs: step 04, a team rule"
git push
gh pr create --base step/03-explain-and-fix --head step/04-team-rule --title "Step 04 · A team rule"
git tag -a step-04 -m "Step 04: a team rule"
git push origin step-04
```

### step-05 · A big change needs an ADR

```bash
git checkout -b step/05-adr step/04-team-rule
# generated: src/countries.ts, from Intl.DisplayNames (Node's CLDR data)
# written by hand: src/countries.test.ts, src/address.ts, src/address.test.ts
pnpm test
git add -A
npx redlinegate@latest review --base step/04-team-rule
git commit -m "feat: parse addresses, with the country checked against ISO 3166"
git push -u origin step/05-adr
gh pr create --base step/04-team-rule --head step/05-adr --title "Step 05 · A big change needs an ADR"
# ADR required for significant changes fails: 352 changed lines, no ADR link
# written by hand: docs/adr/0001-country-list-in-code.md
git add docs/adr
git commit -m "docs: ADR 0001, the country list lives in code"
git push
gh pr edit 5 --body-file pr-body.md   # adds "## Architecture decision" with the ADR link
# written by hand: docs/05-adr.md, README and docs/README.md rows, this entry
git add docs README.md
git commit -m "docs: step 05, a big change needs an ADR"
git push
git tag -a step-05 -m "Step 05: a big change needs an ADR"
git push origin step-05
```

### step-06 · The security floor

```bash
git checkout -b step/06-security-floor step/05-adr
pnpm add lodash@4.17.20 --save-exact
pnpm add -D @types/lodash
# written by hand: src/directory.ts, src/directory.test.ts
pnpm test
git add -A
git commit -m "feat: group countries by initial, with lodash"
git push -u origin step/06-security-floor
gh pr create --base step/05-adr --head step/06-security-floor --title "Step 06 · The security floor"
# Dependency review fails (two HIGH advisories), and so does the gate
gh pr edit 6 --add-label redline-exempt      # the gate still fails: labels never waive the floor
gh pr edit 6 --remove-label redline-exempt
pnpm add lodash@4.18.1 --save-exact
pnpm test
git add -A
git commit -m "fix(deps): lodash 4.18.1, past GHSA-35jh-r3h4-6jhm and GHSA-r5fr-rjxr-66jc"
git push
# written by hand: docs/06-security-floor.md, README and docs/README.md rows, this entry
git add docs README.md
git commit -m "docs: step 06, the security floor"
git push
git tag -a step-06 -m "Step 06: the security floor"
git push origin step-06
```

### step-07 · Make the gate a required check

```bash
git checkout main && git pull
npx redlinegate@latest init --blocking
# settings applied; the pull request was refused because origin still has redline/onboard
git branch step/07-blocking redline/onboard
git branch -f redline/onboard origin/redline/onboard
git checkout step/07-blocking
git push -u origin step/07-blocking
gh pr create --base main --head step/07-blocking --title "Step 07 · Make the gate a required check"
pnpm add lodash@4.17.20 --save-exact
git commit -am "chore(deps): pin lodash 4.17.20 to show a required gate blocking the merge"
git push
gh pr view 12 --json mergeStateStatus      # BLOCKED
git revert --no-edit HEAD
git push
gh pr view 12 --json mergeStateStatus      # CLEAN
# #12 merged; then, on a new branch from main:
git checkout main && git pull && git checkout -b step/07-docs
# written by hand: docs/07-blocking.md, README and docs/README.md rows, this entry
git add docs README.md
git commit -m "docs: step 07, make the gate a required check"
git push -u origin step/07-docs
gh pr create --base main --head step/07-docs --title "Step 07 · Docs"
```

### step-08 · Exemptions

```bash
git checkout -b step/08-exemption step/07-docs
# by hand: loadUser renamed to parseUser in src/user.ts and src/user.test.ts
pnpm test
git commit -am "feat!: rename loadUser to parseUser, matching parseAddress"
git push -u origin step/08-exemption
gh pr create --base main --head step/08-exemption --title "Step 08 · Exemptions"   # "Rollback is safe" left unticked
gh pr edit 14 --add-label redline-exempt        # warns: a label alone exempts nothing
# written by hand: the "## Redline exemption" block, in pr-body.md
npx redlinegate@latest exempt --body-file pr-body.md --scope checklist
npx redlinegate@latest exempt --body-file pr-body.md --scope adr      # refused: out of scope
gh pr edit 14 --body-file pr-body.md
# written by hand: docs/08-exemption.md, README and docs/README.md rows, this entry
git add docs README.md
git commit -m "docs: step 08, exemptions"
git push
```

### step-09 · Earn a stricter rung

```bash
git checkout -b step/09-earn-a-rung step/08-exemption
npx redlinegate@latest evidence                          # none recorded
npx redlinegate@latest init --rung warn --no-commit      # refused: 0 of 5 pull requests
git checkout .redline.json                               # drop the lastRunAt-only change
npx redlinegate@latest evidence record \
  --source "redline-demo PRs #2-#6, #12 and #14: the gate's Deterministic policy job ran on each; all 4 findings raised on #2 were fixed in #3" \
  --sample-size 7 --acted-on-rate 1
npx redlinegate@latest init --rung warn --no-commit      # observe -> warn
npx redlinegate@latest init --rung block-blocker --no-commit   # refused: 7 of 20, no corpus scores
pnpm test
git add .redline.json .github/workflows/redline.yml
git commit -m "chore(redline): warn rung, on 7 reviewed pull requests"
git push -u origin step/09-earn-a-rung
gh pr create --base main --head step/09-earn-a-rung --title "Step 09 · Earn a stricter rung"
# written by hand: docs/09-earn-a-rung.md, README and docs/README.md rows, this entry
git add docs README.md
git commit -m "docs: step 09, earn a stricter rung"
git push
```

### step-09, updated · Redline 0.2.6 and 0.2.7

0.2.6 merged the `warn` rung into `observe` and moved the gate's actions to their current major versions. 0.2.7 made the gate refuse a soft-fail label that has no valid exemption block (`exemption-enforcement: require`).

```bash
git checkout main && git pull
git checkout -b step/09-three-rungs
npx redlinegate@0.2.6 init --no-commit                   # rung: warn -> observe, vendored gate 0.2.5 -> 0.2.6
npx redlinegate@0.2.6 evidence                           # 7 of 20 pull requests, no corpus scores
npx redlinegate@0.2.6 init --rung block-blocker --no-commit   # refused, with the three reasons
pnpm test
# written by hand: docs/09-earn-a-rung.md and docs/07-blocking.md, the README row, this entry
git add -A
git commit -m "chore(redline): 0.2.6, observe again now that warn is merged into it"
git push -u origin step/09-three-rungs
gh pr create --base main --head step/09-three-rungs --title "Step 09 · Updated for Redline 0.2.6"
npx redlinegate@0.2.7 init --no-commit                   # vendored gate 0.2.6 -> 0.2.7
git add -A
git commit -m "chore(redline): 0.2.7, exemptions require a block"
git push
```

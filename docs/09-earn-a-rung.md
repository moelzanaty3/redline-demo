# 09 · Earn a stricter rung

**Tag:** `step-09` · **Pull request:** [#15](https://github.com/moelzanaty3/redline-demo/pull/15)

Every repository starts at `observe`: Redline reports and blocks nothing beyond the security floor. Going stricter isn't a setting you flip. Each rung asks for a measurement, and Redline refuses the promotion without one.

## The ladder

| Rung | A failing rule… | To get here |
|---|---|---|
| `observe` | is reported | where every repository starts |
| `warn` | is reported | 5 reviewed pull requests |
| `block-blocker` | stops the merge if it's a `BLOCKER` | 20 reviewed pull requests, 60% of findings acted on, every seeded `BLOCKER` caught, zero false positives on correct code |
| `block-high` | stops the merge if it's a `BLOCKER` or `HIGH` | 50 reviewed pull requests, 80% acted on, the same corpus scores |

Measurements older than 90 days don't count. The security floor (step 06) is off this ladder: it blocks at every rung.

## Ask before you've measured anything

```bash
git checkout step-08
npx redlinegate@latest evidence
```

```
rung         observe
evidence     none recorded — nothing can raise the rung until something does

not yet eligible for warn:
  - 5 reviewed pull requests are needed and 0 have been recorded — a perfect rate over a handful is a coincidence, not evidence
```

Asking for the promotion anyway changes nothing:

```bash
npx redlinegate@latest init --rung warn --no-commit
```

```
  ▲ enforcement stays at observe — cannot move to warn:
  ▲ 5 reviewed pull requests are needed and 0 have been recorded
```

## Record what was measured

The gate has reviewed seven pull requests here with code in them: #2–#6, #12 and #14. It raised four findings, all on #2, and #3 fixed every one.

```bash
npx redlinegate@latest evidence record \
  --source "redline-demo PRs #2-#6, #12 and #14: the gate's Deterministic policy job ran on each; all 4 findings raised on #2 were fixed in #3" \
  --sample-size 7 \
  --acted-on-rate 1
```

```
recorded.

rung         observe
seed recall  not measured
acted on     100%
sample       7 pull request(s)
false pos.   not measured
recorded     2026-10-12 (0 day(s) ago) — redline-demo PRs #2-#6, #12 and #14: …

eligible for warn — raise it with: redline init --rung warn
```

`--source` is required: a figure with no source is just a claim. The record goes into `.redline.json` under `evidence`, and it's reviewed in the pull request like any other change.

## Raise it

```bash
npx redlinegate@latest init --rung warn --no-commit
```

```
  ▲ enforcement: observe -> warn
```

That changes `rung: observe` to `rung: warn` in `.github/workflows/redline.yml`, and `"rung"` in `.redline.json`. On [#15](https://github.com/moelzanaty3/redline-demo/pull/15) the gate runs with `RUNG: warn`, and every check is green.

At this version of the gate, `warn` behaves like `observe` on a pull request: neither blocks, and the gate's message names the rung. What changes is the record. The repository has shown its reviewer runs, and it has taken the step that `block-blocker` requires before it.

## The next rung is refused

```bash
npx redlinegate@latest init --rung block-blocker --no-commit
```

```
  ▲ enforcement stays at warn — cannot move to block-blocker:
  ▲ 20 reviewed pull requests are needed and 7 have been recorded — a perfect
    rate over a handful is a coincidence, not evidence
  ▲ the seeded corpus has never been scored for this stack, so there is no
    evidence the reviewer catches known defects at all
  ▲ the clean corpus has never been scored, so nothing shows the reviewer stays
    quiet on correct code
```

That's the right answer. Seven pull requests of a demo say nothing about whether the rules would wrongly block a real team's work. A blocking rung needs three things: the reviewer must catch every known defect in a seeded corpus, flag nothing in a clean one, and show 20 pull requests of people agreeing with what it found. With `block-blocker` reached, step 02's code would no longer merge, and step 08's exemption would be the only way past a failing process check.

## Going down is always allowed

```bash
npx redlinegate@latest init --rung observe
```

A demotion needs no evidence. If a rung is blocking good work, step down first and investigate after.

**This is the last step.** `git log --first-parent main` lists each step as one entry, and the README's build log has every command used to make them.

# 09 · Earn a stricter rung

**Tag:** `step-09` · **Pull requests:** [#15](https://github.com/moelzanaty3/redline-demo/pull/15), updated for Redline 0.2.6 in [#16](https://github.com/moelzanaty3/redline-demo/pull/16)

Every repository starts at `observe`: Redline reports every finding, and only the security floor can fail the gate. Blocking on findings isn't a setting you flip. Each rung above `observe` asks for a measurement, and Redline refuses the promotion without one.

## The ladder

| Rung | A failing rule… | To get here |
|---|---|---|
| `observe` | is reported, and shows as a red check | where every repository starts |
| `block-blocker` | stops the merge if it's a `BLOCKER` | 20 reviewed pull requests, 60% of findings acted on, every seeded `BLOCKER` caught, zero false positives on correct code |
| `block-high` | stops the merge if it's a `BLOCKER` or `HIGH` | 50 reviewed pull requests, 80% acted on, the same corpus scores |

Measurements older than 90 days don't count. You climb one rung at a time. The security floor (step 06) is off this ladder and blocks at every rung.

## Record what was measured

The gate has reviewed seven pull requests here with code in them: #2–#6, #12 and #14. It raised four findings, all on #2, and #3 fixed every one.

```bash
git checkout step-09
npx redlinegate@latest evidence record \
  --source "redline-demo PRs #2-#6, #12 and #14: the gate's Deterministic policy job ran on each; all 4 findings raised on #2 were fixed in #3" \
  --sample-size 7 \
  --acted-on-rate 1
```

`--source` is required: a figure with no source is just a claim. The record goes into `.redline.json` under `evidence`, and it's reviewed in the pull request like any other change. Only the `evidence` block is added; no other line of the file moves.

## Ask what the next rung needs

```bash
npx redlinegate@latest evidence
```

```
rung         observe
seed recall  not measured
acted on     100%
sample       7 pull request(s)
false pos.   not measured
recorded     2026-10-12 (0 day(s) ago) — redline-demo PRs #2-#6, #12 and #14: …

not yet eligible for block-blocker:
  - 20 reviewed pull requests are needed and 7 have been recorded — a perfect rate over a handful is a coincidence, not evidence
  - the seeded corpus has never been scored for this stack, so there is no evidence the reviewer catches known defects at all
  - the clean corpus has never been scored, so nothing shows the reviewer stays quiet on correct code

what block-blocker asks for:
  sample size      >= 20 reviewed pull requests
  seed recall      >= 100%
  acted-on rate    >= 60%
  false positives  <= 0
  measured within  90 days
```

## Ask for it anyway

```bash
npx redlinegate@latest init --rung block-blocker --no-commit
```

```
  ▲ enforcement stays at observe — cannot move to block-blocker:
  ▲ 20 reviewed pull requests are needed and 7 have been recorded — a perfect
    rate over a handful is a coincidence, not evidence
  ▲ the seeded corpus has never been scored for this stack, so there is no
    evidence the reviewer catches known defects at all
  ▲ the clean corpus has never been scored, so nothing shows the reviewer stays
    quiet on correct code
```

That refusal is the right answer. Seven pull requests of a demo say nothing about whether the rules would wrongly block a real team's work. Before Redline may stop a merge on its findings, the reviewer must catch every known defect in a seeded corpus and flag nothing in a clean one, and 20 pull requests must show people agreeing with what it found. Once a repository reaches `block-blocker`, step 02's code would no longer merge, and step 08's exemption becomes the only way past a failing process check.

## Going down is always allowed

```bash
npx redlinegate@latest init --rung observe
```

A demotion needs no evidence. If a rung is blocking good work, step down first and investigate after.

## What changed in Redline 0.2.6

Until 0.2.6 the ladder had a fourth rung, `warn`, between `observe` and `block-blocker`. This step first promoted the repository to it ([#15](https://github.com/moelzanaty3/redline-demo/pull/15)). But the gate treated `warn` exactly like `observe`: nothing blocked, and the report was the same. So it was merged into `observe`. Re-running `init` on 0.2.6 ([#16](https://github.com/moelzanaty3/redline-demo/pull/16)) wrote the repository back as `observe`, and the gate's behaviour didn't change. Asking for the old rung now says so:

```
error  the "warn" rung was merged into "observe" — it reported exactly what observe does and blocked nothing
       use --rung observe, or --rung block-blocker to start blocking on recorded evidence
```

The same run moved the vendored gate to 0.2.6, with its actions on their current major versions. A second run on 0.2.7 moved it again: from 0.2.7 a soft-fail label with no valid exemption block is refused (`exemption-enforcement: require`), so step 08's bare label would no longer be accepted at a blocking rung.

**This is the last step.** `git log --first-parent main` lists each step as one entry, and the README's build log has every command used to make them.

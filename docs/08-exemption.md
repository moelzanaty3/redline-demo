# 08 · Exemptions

**Tag:** `step-08` · **Pull request:** [#14](https://github.com/moelzanaty3/redline-demo/pull/14)

Sometimes a process check is right and you merge anyway, on purpose. An exemption records that decision: what is being accepted, why, until when, and for which check. A label marks the pull request, and a block in its description holds the record.

## The change

`loadUser` is renamed `parseUser` to match `parseAddress`, with no alias left behind:

```bash
git checkout step-08
pnpm test
```

That's a breaking change for anyone importing `loadUser`. So the checklist item **Rollback is safe (no destructive migration, no breaking contract change)** is honestly false, and it stays unticked:

```
Error: 1 unchecked launch-readiness item(s). Tick each one, or delete the line and say why in the PR description.
```

**PR checklist** fails. The gate passes at `observe`:

```
Warning: Process checks failed: checklist. This repository is at rung 'observe', which reports and does not block.
Redline gate passed.
```

## A label alone

The `redline-exempt` label on its own:

```
Soft-fail label present: redline-exempt
warn  the pull request has no "## Redline exemption" section — a label alone no longer exempts anything
Warning: This exemption has no valid `## Redline exemption` block. It is being accepted this time;
         once this repository moves to require, it will not be.
```

A label says that something was waived, but not why, by whom or for how long.

## The exemption block

Fill in the section the pull request template already has:

```md
## Redline exemption

- reason: parseUser replaces loadUser with no alias, so a consumer that upgrades cannot roll back without renaming its import again. Nothing outside this repository imports it yet, and the rename lands before the 1.0 API is frozen.
- until: 2026-11-30
- scope: checklist
```

| Field | Rule |
|---|---|
| `reason` | At least 20 characters. Say what is accepted and why, so a reader in three months can act on it |
| `until` | `YYYY-MM-DD`, at most 90 days out. Anything longer is a standards change, not an exemption |
| `scope` | The checks it covers: `checklist`, `adr`, `policy`. Leave it out to cover all of them |

Check it on your machine before pushing, against the check that's failing:

```bash
gh pr view 14 --json body --jq .body > body.md
npx redlinegate@latest exempt --body-file body.md --scope checklist
```

```
exempt until 2026-11-30 (checklist): parseUser replaces loadUser with no alias, …
```

The gate runs the same command on every failing process check:

```
Soft-fail label present: redline-exempt
exempt until 2026-11-30 (checklist): parseUser replaces loadUser with no alias, …
Redline gate passed.
```

## What it refuses

```bash
npx redlinegate@latest exempt --body-file body.md --scope adr
```

```
warn  the exemption covers checklist — it does not cover "adr". Widen its scope deliberately, or fix the check.
```

An expiry too far out:

```
warn  `until: 2027-06-01` is 232 days away; the maximum is 90 — a longer exemption is a standards change, not an exemption
```

A reason that says nothing:

```
warn  the reason is 18 characters; at least 20 are required — "needed for release" tells a later reader nothing
```

None of this applies to dependency review or the secret scan. Step 06 showed the label being ignored there, and a block is ignored the same way.

## Why it matters more later

At `observe`, a failing process check doesn't block, so the exemption changes nothing about the merge here. It does change the record: the gate logs who accepted what, and until when. Once the repository reaches `block-blocker`, a failing process check stops the merge, and a valid exemption becomes the only way through. Two settings tighten this further:

- `exemption-enforcement: require` in `.github/workflows/redline.yml` refuses a label that has no valid block.
- `soft-fail-labels` lists the labels that can exempt anything. Step 01's onboarding pull request carried the other one, `redline-sync`.

**Next:** `git checkout step-09`, then read `docs/09-earn-a-rung.md`.

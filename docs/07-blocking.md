# 07 · Make the gate a required check

**Tag:** `step-07` · **Pull request:** [#12](https://github.com/moelzanaty3/redline-demo/pull/12)

Until now the gate's result was advice. A red gate showed on the pull request, but GitHub still let you merge, as step 06 showed. This step makes `redline-gate / gate` a required status check, so a red gate disables the merge button.

## The command

```bash
git checkout main && git pull
npx redlinegate@latest init --blocking
```

```
  Files  2 written
   + .github/workflows/redline-gate.yml
   + .redline.json

  Repository settings  6 in place · 1 unavailable
   ✓ already     labels             label "no-adr" already exists
   ✓ already     gate               .github/pull_request_template.md is already up to date
   ✓ applied     secret-scanning    secret scanning
   ✓ applied     push-protection    secret scanning push protection
   ✓ applied     dependency-alerts  dependabot alerts (vulnerability alerts)
   ✓ applied     merge-policy       branch ruleset
   · unsupported repo-property      repository property "redline=onboarded" (not available on this repository)
```

`merge-policy` is the change: the `Redline` ruleset on `main` now has a **Require status checks to pass** rule naming `redline-gate / gate`. It still requires no approving review, and nobody is on the bypass list, admins included. `.redline.json` records `"blockingGate": true`, so a later plain `init` keeps the gate blocking instead of quietly undoing it.

`blocking` and the rung are separate settings:

| Setting | Decides | Here |
|---|---|---|
| `--blocking` | whether a red gate stops the merge | on |
| `--rung` | which failures turn the gate red | `observe`: only the security floor |

So at this step only dependency review and the secret scan can stop a merge. A broken rule like step 02's still leaves the gate green until the rung is raised, which step 09 covers.

## When `redline/onboard` still exists

`init` commits to the branch `redline/onboard` and opens a pull request from it. This repository keeps every branch for the walkthrough, so `origin` still had `redline/onboard` from step 01, and the push was refused:

```
error  could not open the pull request: origin already has a "redline/onboard" branch this push cannot fast-forward
       the Redline changes are on branch redline/onboard — push it if it is not already on origin, then open the pull request manually
```

The repository settings had already been applied at that point. Only the pull request was missing. The fix is to move the commit to a branch of its own:

```bash
git branch step/07-blocking redline/onboard
git branch -f redline/onboard origin/redline/onboard
git push -u origin step/07-blocking
gh pr create --base main --head step/07-blocking --title "Step 07 · Make the gate a required check"
```

From Redline 0.2.6 this no longer happens. When `redline/onboard` is taken, locally or on `origin`, `init` uses the next free name (`redline/onboard-2`, …) and never moves an existing branch.

## See it block

[#12](https://github.com/moelzanaty3/redline-demo/pull/12) was green and mergeable (`CLEAN`). One commit pinned step 06's vulnerable lodash again:

```bash
pnpm add lodash@4.17.20 --save-exact
git commit -am "chore(deps): pin lodash 4.17.20 to show a required gate blocking the merge"
git push
gh pr view 12 --json mergeStateStatus
```

```json
{"mergeStateStatus":"BLOCKED"}
```

Dependency review failed, the gate failed, and the merge button was disabled for everyone. Reverting the commit brought it back:

```bash
git revert --no-edit HEAD
git push
gh pr view 12 --json mergeStateStatus
```

```json
{"mergeStateStatus":"CLEAN"}
```

## Check the ruleset

On GitHub: **Settings → Rules → Rulesets → Redline**. Or:

```bash
gh api repos/moelzanaty3/redline-demo/rulesets --jq '.[].id' \
  | xargs -I{} gh api repos/moelzanaty3/redline-demo/rulesets/{} \
      --jq '.rules[] | select(.type=="required_status_checks") | .parameters.required_status_checks'
```

```json
[{"context":"redline-gate / gate"}]
```

## A vendored gate that blocks

This repository uses `--gate-source local`: the gate's workflow lives in `.github/workflows/redline-gate.yml`, and a pull request runs the copy on its own branch. Once the gate is required, a pull request that edits that file can weaken the check that's judging it. `init` warns about this on every run. Close the gap with one of these:

- Require an owner's review on `.github/workflows/`: `init --with review-ownership --review-owners <team>` writes a `CODEOWNERS` entry and turns on code-owner review.
- Use the organisation's gate (`--gate-source org`), which a pull request in this repository can't edit.

**Next:** `git checkout step-08`, then read `docs/08-exemption.md`.

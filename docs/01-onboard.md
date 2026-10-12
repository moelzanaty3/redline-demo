# 01 · Onboard with Redline

**Tag:** `step-01` · **Pull request:** [#1](https://github.com/moelzanaty3/redline-demo/pull/1)

One command adds the rules, the review commands for each assistant, and a merge gate, then opens a pull request with all of it.

## The command

```bash
npx redlinegate@latest init --gate-source local
```

`--gate-source local` puts the gate's workflow inside this repository (`.github/workflows/redline-gate.yml`), so the demo's pipeline is self-contained. Without the flag, the gate is referenced from your organisation's `.github` repository, which is the stronger setup for a real team, because a pull request then can't edit the gate that's judging it. `init` prints that warning itself.

## What it printed

```
  profile tooling
  Files  21 written
   + AGENTS.md
   + CLAUDE.md
   + .github/copilot-instructions.md
   + .github/workflows/redline.yml
   + .github/workflows/redline-gate.yml
   + .github/pull_request_template.md
   + .redline.json
   …
  Repository settings  6 in place · 1 unavailable
   ✓ applied     labels             label "no-adr"
   ✓ applied     gate               wrote .github/pull_request_template.md
   ✓ applied     secret-scanning    secret scanning
   ✓ applied     push-protection    secret scanning push protection
   ✓ applied     dependency-alerts  dependabot alerts (vulnerability alerts)
   ✓ applied     merge-policy       branch ruleset
   · unsupported repo-property      repository property "redline=onboarded" (not
                                    available on this repository)
  Pull request
   https://github.com/moelzanaty3/redline-demo/pull/1
```

`repo-property` needs a GitHub organisation, so it's unavailable on a personal account. Nothing else depends on it.

## What it added

| Files | For |
|---|---|
| `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.github/instructions/`, `.cursor/rules/` | The rules, in the form each assistant reads on every request |
| `.claude/commands/`, `.github/prompts/`, `.cursor/commands/` | `/redline-init`, `/redline-review` and `/redline-verify` for each assistant |
| `.github/workflows/redline.yml`, `.github/workflows/redline-gate.yml` | The gate that runs on every pull request |
| `.github/pull_request_template.md` | The pull request checklist the gate reads |
| `.redline.json` | What was installed, at which version, and the choices made |

## What it changed on GitHub

- **Branch ruleset `Redline` on `main`:** changes arrive through a pull request, review threads must be resolved, and `main` can't be deleted or force-pushed. It requires **no approving review**: Redline's job is to fail the pipeline, and whether a person must also approve is your choice (`init --approvals <n>`). That's why a solo engineer can merge here.
- **Security floor:** secret scanning, push protection and Dependabot alerts are on.
- **Label `no-adr`:** the label the ADR check accepts.

## What the pull request's checks said

| Check | Result | Why |
|---|---|---|
| `test` | ✅ | The CI from step 00 |
| Deterministic policy | ✅ | No rule broken in the added files |
| Secret scan (diff) | ✅ | No secret in the diff |
| Dependency review | ✅ | No vulnerable dependency added |
| PR checklist | ❌ | The onboarding PR's description has no `## Launch readiness` section |
| ADR required for significant changes | ❌ | 1951 changed lines, over the 300-line threshold, with no ADR link |
| **`gate`** | ✅ | The verdict that counts, below |

The gate combines the jobs into one verdict. Its log explains why it passed with two red jobs:

```
warning: This exemption has no valid `## Redline exemption` block. It is being accepted this time;
         once this repository moves to require, it will not be.
warning: Process checks failed: checklist adr. This repository is at rung 'observe', which reports
         and does not block. The findings are recorded either way.
```

Two things let it through. The onboarding PR carries the `redline-sync` label, which the gate treats as a soft-fail label. And the repository is at the `observe` rung, where process checks report but never block. Step 06 shows a proper exemption, and step 07 makes the gate required.

## Try it

```bash
git checkout step-01
npx redlinegate@latest status
```

```
profile      tooling (javascript, typescript)
host         github
checks       GitHub Actions
rung         observe — comments only, the check is always green
assistants   copilot, agents, codex, claude, cursor
installed    gate, merge-policy, labels
standards    0.2.1 — current
```

**Next:** `git checkout step-02`, then read `docs/02-first-finding.md`.

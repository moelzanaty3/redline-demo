# 05 · A big change needs an ADR

**Tag:** `step-05` · **Pull request:** [#5](https://github.com/moelzanaty3/redline-demo/pull/5)

A large change usually carries a decision someone will later want to understand. Redline asks for that decision to be written down: past 300 changed lines, the pull request must link an Architecture Decision Record (ADR).

## The change

`parseAddress` in `src/address.ts` refuses an address whose country isn't real. The country list it checks against, `src/countries.ts`, is a 249-entry ISO 3166 table generated from the CLDR data that ships with Node. With tests it comes to 352 changed lines.

```bash
git checkout step-05
pnpm test
```

```
ℹ pass 10
ℹ fail 0
```

## Without an ADR

The first push of [#5](https://github.com/moelzanaty3/redline-demo/pull/5) had no ADR link in its description:

```
changed=352 threshold=300 adr-links=0 no-adr-label=0
Error: 352 changed lines with no ADR link. Add docs/adr/NNNN-*.md and link it in the PR body,
       or apply the 'no-adr' label with a justification comment.
```

**ADR required for significant changes** failed. The gate still passed, because the repository is at `observe`, where process checks report without blocking.

## With an ADR

[`docs/adr/0001-country-list-in-code.md`](adr/0001-country-list-in-code.md) records the decision in four parts: the context, the options (a dependency, a lookup service, a table in code), the choice, and its consequences. The PR description links it under `## Architecture decision`:

```md
## Architecture decision

ADR: [`docs/adr/0001-country-list-in-code.md`](https://github.com/moelzanaty3/redline-demo/blob/main/docs/adr/0001-country-list-in-code.md)
```

Editing the description re-runs the gate, with no new commit needed:

```
changed=375 threshold=300 adr-links=1 no-adr-label=0
```

Every check is green.

## What the check reads

| Input | Where |
|---|---|
| Changed lines | additions + deletions on the pull request |
| Threshold | `adr-diff-threshold: 300` in `.github/workflows/redline.yml` |
| ADR link | any `docs/adr/` path in the PR description |
| Opt-out | the `no-adr` label, for a change that's large but makes no decision, such as a generated lockfile or a rename. Say why in a comment |

**Next:** `git checkout step-06`, then read `docs/06-exemption.md`.

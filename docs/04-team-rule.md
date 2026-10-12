# 04 · A team rule

**Tag:** `step-04` · **Pull request:** [#4](https://github.com/moelzanaty3/redline-demo/pull/4)

The org standard covers what every repository shares. Your team will have rules of its own. They go in one file, `.redline/local.md`, and Redline puts them everywhere the org rules already go.

## The rule

`.redline/local.md`:

```md
## Errors are returned, not logged

This service is a library: the code that calls it decides what to log and where.

- `local/no-console` — No `console.*` calls in `src/`. Throw an `Error` with a message that says what was wrong, and let the caller log it.
```

Give every rule an id in backticks, `local/<slug>`. Findings quote the id, which is how you can tell which rules fire and which are noise.

## Render it

```bash
npx redlinegate@latest init --no-commit
```

```
  Files  6 written
   + .github/copilot-instructions.md
   + AGENTS.md
   + CLAUDE.md
   + .cursor/rules/redline-core.mdc
   + .github/workflows/redline-gate.yml
   + .redline.json

  not committed — the files are in your working tree. Review them, commit them, then run redline init to apply the repository settings and open the pull request
```

`--no-commit` writes the files and stops, so you can read the diff before anything is pushed. Each assistant file gains a `# Repository-local rules` section with your rule, and `.redline.json` records `"localRules": true`. The gate file changes only because this run used a newer Redline, and the vendored gate is stamped with the version that wrote it.

A re-run keeps what was chosen at onboarding: the rung, the gate source and the approvals. It also leaves the security jobs alone. `.redline.json` still says `"integrations": []`, and `.github/workflows/redline.yml` still says `stand-down: ''`, so the secret scan and dependency review still run.

## Who checks it

A team rule is written in prose, so a model applies it, not the checker:

| Where | Sees `local/no-console`? |
|---|---|
| Your assistant, while writing code | ✅ it reads `AGENTS.md`, `CLAUDE.md`, the Copilot instructions or the Cursor rules on every request |
| `/redline-review` in your assistant | ✅ the rule is in the review prompt |
| `npx redlinegate@latest review` (the checker) | ❌ it runs only the rules a checker can decide |
| The gate's **Deterministic policy** job | ❌ same checker |

You can see the rule in the prompt the assistant review uses, in its `# Repository-local rules` section:

```bash
npx redlinegate@latest review --print-prompt | grep no-console
```

This needs redlinegate 0.2.5 or later. Building this step showed that earlier versions left `.redline/local.md` out of the review prompt, so `/redline-review` ignored team rules. That was fixed in [redline#30](https://github.com/moelzanaty3/redline/pull/30).

## Try it

Add a `console.log` and ask your assistant to review:

```bash
git checkout step-04
cat > src/greet.ts <<'EOF'
export function greet(name: string): string {
  console.log('greeting', name)
  return 'hi ' + name
}
EOF
git add src/greet.ts
```

Then run `/redline-review` in Claude Code, Copilot Chat or Cursor. Expect a finding tagged `[local/no-console]` on line 2. The local checker, `npx redlinegate@latest review`, reports nothing for it. Throw the file away afterwards:

```bash
git rm -f src/greet.ts
```

**Next:** `git checkout step-05`, then read `docs/05-adr.md`.

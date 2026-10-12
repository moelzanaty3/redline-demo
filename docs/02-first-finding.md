# 02 · Your first finding

**Tag:** `step-02` · **Pull request:** [#2](https://github.com/moelzanaty3/redline-demo/pull/2)

This step adds code that looks like a normal afternoon's work and breaks four Redline rules. You'll see the same four findings on your machine and in the pipeline.

## The change

`src/user.ts`, the way an assistant writes it when told to make a type error go away:

```ts
type User = { id: string; name: string }

// TODO: handle retries
export function loadUser(raw: string) {
  // @ts-ignore
  return JSON.parse(raw) as unknown as User
}

export type Payload = unknown
```

It compiles, and the existing tests still pass. Nothing at step 00 would have noticed anything.

## On your machine

```bash
git checkout step-02
npx redlinegate@latest review --base step-01
```

```
profile tooling — rules in scope: core, typescript
src/user.ts:3
  Redline/HIGH [core/untracked-todo]: this TODO carries no ticket reference, so nothing will bring anyone back to it.
src/user.ts:5
  Redline/BLOCKER [core/type-checker-suppression]: a type-checker suppression needs an inline explanation AND a ticket reference on the same line.
src/user.ts:6
  Redline/BLOCKER [core/unsafe-assertion]: a double assertion overrides the type checker with no stated reason.
src/user.ts:9
  Redline/HIGH [typescript/unknown-type-alias]: this alias names `unknown`, so it reads as a contract it is not.
4 finding(s)
```

`--base` sets what the review compares against. While you're working, leave it out, and the review compares against your default branch.

Every finding has three parts: a **severity** (`BLOCKER` must not merge, `HIGH` is a deliberate trade-off, `SUGGESTION` is optional), a **rule id** in brackets, and the problem with its fix.

## In the pipeline

| Check | Result |
|---|---|
| `test` | ✅ |
| **Deterministic policy** | ❌ the same 4 findings, `4 finding(s) from 53 deterministic rule(s)` |
| PR checklist | ✅ |
| ADR | ✅ under 300 lines |
| Dependency review | ✅ |
| Secret scan (diff) | ✅ |
| **`gate`** | ✅ |

The gate passes because the repository is at the `observe` rung:

```
warning: Process checks failed: policy. This repository is at rung 'observe', which reports and
         does not block. The findings are recorded either way.
```

`observe` is where every repository starts. Redline reports first, so a team can see what it would block before anything is blocked. Step 09 shows how a repository earns a stricter rung.

## The pull request description

The gate reads the `## Launch readiness` checklist from the PR description. One item, "Input validated at boundaries", is honestly false here, because this code skips validation on purpose. The template's rule is to delete the line and say why in the Summary, and that's what [#2](https://github.com/moelzanaty3/redline-demo/pull/2) does. Ticking a box that isn't true would defeat the checklist.

**Next:** `git checkout step-03`, then read `docs/03-explain-and-fix.md`.

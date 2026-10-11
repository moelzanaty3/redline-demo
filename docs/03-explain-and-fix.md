# 03 · Explain and fix

**Tag:** `step-03` · **Pull request:** [#3](https://github.com/moelzanaty3/redline-demo/pull/3)

A finding is only useful if you can find out why the rule exists. Ask Redline, then fix the code properly rather than silencing it.

## Ask what a rule means

Pass the id from the brackets of any finding:

```bash
npx redlinegate@latest explain core/unsafe-assertion
```

```
BLOCKER core/unsafe-assertion

  No unsafe assertions (`as unknown as X`, force casts) used to silence an error. Where one is
  genuinely required, the justification is a `SAFETY:` comment on the same line or the line above,
  stating why the assertion holds (`// SAFETY: payload parsed by the schema above`). Any other
  comment does not count.

  decided by   a checker, with no model call
  defined in   standards/core.md:87
  applies to   every file — the core standard is not scoped by stack
  reaches      tooling, web-react, web-next, … every profile
```

It tells you whether a checker or a model decides the rule, and where the rule is written down. If you disagree with a rule, that's the place to change it. `explain --list` prints every rule id.

## The fix

`src/user.ts` now checks the parsed JSON with a type predicate before returning it as a `User`. That leaves nothing to assert or suppress, and the `TODO` and the `unknown` alias are gone:

```ts
export type User = { id: string; name: string }

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string'
  )
}

export function loadUser(raw: string): User {
  const parsed: unknown = JSON.parse(raw)
  if (!isUser(parsed)) throw new Error('payload is not a User')
  return parsed
}
```

`src/user.test.ts` covers both outcomes: a valid payload becomes a `User`, and a payload with a missing field is refused.

A `// SAFETY:` comment above the assertion would also have silenced `core/unsafe-assertion`. It's meant for the rare assertion that is genuinely correct. Here the comment would have been false.

## Check it

```bash
git checkout step-03
pnpm test
npx redlinegate@latest review --base step-01
```

```
ℹ pass 4
ℹ fail 0

profile tooling — rules in scope: core, typescript
no findings
```

In the pipeline, every check on [#3](https://github.com/moelzanaty3/redline-demo/pull/3) is green, including **Deterministic policy**. The PR description has its input-validation item back, ticked, because the code now validates.

**Next:** `git checkout step-04`, then read `docs/04-team-rule.md`.

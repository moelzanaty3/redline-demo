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

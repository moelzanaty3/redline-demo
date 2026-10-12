type User = { id: string; name: string }

// TODO: handle retries
export function loadUser(raw: string) {
  // @ts-ignore
  return JSON.parse(raw) as unknown as User
}

export type Payload = unknown

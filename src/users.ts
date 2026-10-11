export type User = { id: string; name: string; email: string }

export class UserDirectory {
  private readonly users = new Map<string, User>()

  add(user: User): void {
    if (this.users.has(user.id)) throw new Error(`user ${user.id} already exists`)
    this.users.set(user.id, user)
  }

  find(id: string): User | undefined {
    return this.users.get(id)
  }

  count(): number {
    return this.users.size
  }
}

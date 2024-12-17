import { Prisma, Role, User } from '@prisma/client'
import { IUsersRepository } from '../users.repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[] = []

  async create({ name, email, hashedPassword }: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name,
      email,
      hashedPassword,
      role: Role.USER,
      createdAt: new Date()
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email) || null

    return user
  }

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id) || null

    return user
  }
}

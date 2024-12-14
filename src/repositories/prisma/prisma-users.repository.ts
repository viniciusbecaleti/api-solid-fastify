import { prisma } from '@/libs/prisma'
import { type Prisma } from '@prisma/client'
import { IUsersRepository } from '../users.repository'

export class PrismaUsersRepository implements IUsersRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    return user
  }

  async create({ name, email, hashedPassword }: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword
      }
    })

    return user
  }
}

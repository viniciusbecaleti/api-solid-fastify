import { prisma } from '@/libs/prisma'
import { type Prisma } from '@prisma/client'

export class PrismaUsersRepository {
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

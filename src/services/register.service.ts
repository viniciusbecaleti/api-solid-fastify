import { prisma } from '@/libs/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users.repository'
import { genSalt, hash } from 'bcryptjs'

interface RegisterServiceProps {
  name: string
  email: string
  password: string
}

export async function registerService({
  name,
  email,
  password
}: RegisterServiceProps) {
  const emailAlreadyExists = await prisma.user.findUnique({
    where: { email }
  })

  if (emailAlreadyExists) {
    throw new Error('Email already exists')
  }

  const salt = await genSalt(10)
  const hashedPassword = await hash(password, salt)

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    hashedPassword
  })
}

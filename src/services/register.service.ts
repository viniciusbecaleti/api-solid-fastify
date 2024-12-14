import { prisma } from '@/libs/prisma'
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

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword
    }
  })
}

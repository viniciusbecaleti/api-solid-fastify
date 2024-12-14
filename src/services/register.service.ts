import { prisma } from '@/libs/prisma'
import { genSalt, hash } from 'bcryptjs'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private readonly usersRepository: any) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const emailAlreadyExists = await prisma.user.findUnique({
      where: { email }
    })

    if (emailAlreadyExists) {
      throw new Error('Email already exists')
    }

    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    await this.usersRepository.create({
      name,
      email,
      hashedPassword
    })
  }
}

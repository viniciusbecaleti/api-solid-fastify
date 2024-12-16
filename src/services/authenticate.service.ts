import { IUsersRepository } from '@/repositories/users.repository'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { compare } from 'bcryptjs'
import type { User } from '@prisma/client'

interface IRequest {
  email: string
  password: string
}

interface IReponse {
  user: User
}

export class AuthenticateService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ email, password }: IRequest): Promise<IReponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isPasswordCorretly = await compare(password, user.hashedPassword)

    if (!isPasswordCorretly) {
      throw new InvalidCredentialsError()
    }

    return {
      user
    }
  }
}

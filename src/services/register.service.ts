import { IUsersRepository } from '@/repositories/users.repository'
import { genSalt, hash } from 'bcryptjs'
import { EmailAlreadyExistsError } from './errors/email-already-exists.error'
import type { User } from '@prisma/client'

interface IRequest {
  name: string
  email: string
  password: string
}

interface IResponse {
  user: User
}

export class RegisterService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: IRequest): Promise<IResponse> {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
    }

    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    const user = await this.usersRepository.create({
      name,
      email,
      hashedPassword
    })

    return {
      user
    }
  }
}

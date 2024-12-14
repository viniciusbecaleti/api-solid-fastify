import { IUsersRepository } from '@/repositories/users.repository'
import { genSalt, hash } from 'bcryptjs'
import { EmailAlreadyExistsError } from './errors/email-already-exists.error'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const emailAlreadyExists = await this.usersRepository.findByEmail(email)

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError()
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

import { IUsersRepository } from '@/repositories/users.repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface IRequest {
  userId: string
}

interface IReponse {
  user: User
}

export class GetUserProfileService {
  constructor(private readonly userRepository: IUsersRepository) {}

  async execute({ userId }: IRequest): Promise<IReponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}

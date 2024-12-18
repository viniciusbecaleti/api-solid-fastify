import { ICheckInsRepository } from '@/repositories/check-ins.repository'
import { CheckIn } from '@prisma/client'

interface IRequest {
  userId: string
  page: number
}

interface IResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor(private readonly ckeckInsRepository: ICheckInsRepository) {}

  async execute({ userId, page }: IRequest): Promise<IResponse> {
    const checkIns = await this.ckeckInsRepository.findManyByUserId(
      userId,
      page
    )

    return { checkIns }
  }
}

import { ICheckInsRepository } from '@/repositories/check-ins.repository'

interface IRequest {
  userId: string
}

interface IResponse {
  checkInsCount: number
}

export class GetUserMetricsService {
  constructor(private readonly ckeckInsRepository: ICheckInsRepository) {}

  async execute({ userId }: IRequest): Promise<IResponse> {
    const checkInsCount = await this.ckeckInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}

import { ICheckInsRepository } from '@/repositories/check-ins.repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

interface IRequest {
  checkInId: string
}

interface IResponse {
  checkIn: CheckIn
}

export class ValidateCheckInService {
  constructor(private readonly checkInsRepository: ICheckInsRepository) {}

  async execute({ checkInId }: IRequest): Promise<IResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validatedAt = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}

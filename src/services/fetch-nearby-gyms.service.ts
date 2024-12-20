import { IGymsRepository } from '@/repositories/gyms.repository'
import { Gym } from '@prisma/client'

interface IRequest {
  userLagitude: number
  userLongitude: number
}

interface IResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsService {
  constructor(private readonly gymsRepository: IGymsRepository) {}

  async execute({ userLagitude, userLongitude }: IRequest): Promise<IResponse> {
    const gyms = await this.gymsRepository.findManyNearby(
      userLagitude,
      userLongitude
    )

    return { gyms }
  }
}

import { ICheckInsRepository } from '@/repositories/check-ins.repository'
import { IGymsRepository } from '@/repositories/gyms.repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { getDistanceBetweenCoordinates } from '@/libs/getDistanceBetweenCoordinates'
import { MaxDistanceError } from './errors/max-distance.error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.error'

interface IRequest {
  userId: string
  gymId: string
  userLatitue: number
  userLongitude: number
}

interface IResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(
    private readonly checkInsRepository: ICheckInsRepository,
    private readonly gymsRepository: IGymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitue,
    userLongitude
  }: IRequest): Promise<IResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitue, longitude: userLongitude },
      { latitude: Number(gym.latitude), longitude: Number(gym.longitude) }
    )

    const MAX_DISTANCE_IN_KILOEMTERS = 0.1 // 100m

    if (distance > MAX_DISTANCE_IN_KILOEMTERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      userId,
      gymId
    })

    return { checkIn }
  }
}

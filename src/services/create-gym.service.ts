import { IGymsRepository } from '@/repositories/gyms.repository'
import { Gym } from '@prisma/client'

interface IRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface IResponse {
  gym: Gym
}

export class CreateGymService {
  constructor(private readonly gymsRepository: IGymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude
  }: IRequest): Promise<IResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude
    })

    return { gym }
  }
}

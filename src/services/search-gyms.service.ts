import { IGymsRepository } from '@/repositories/gyms.repository'
import { Gym } from '@prisma/client'

interface IRequest {
  query: string
  page: number
}

interface IResponse {
  gyms: Gym[]
}

export class SearchGymsService {
  constructor(private readonly gymsRepository: IGymsRepository) {}

  async execute({ query, page }: IRequest): Promise<IResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}

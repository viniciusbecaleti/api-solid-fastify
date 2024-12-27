import { Gym, Prisma } from '@prisma/client'
import { IGymsRepository } from '../gyms.repository'
import { prisma } from '@/libs/prisma'

export class PrismaGymsRepository implements IGymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data })

    return gym
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id
      }
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query
        }
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return gyms
  }

  async findManyNearby(userLatitude: number, userLongitude: number) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }
}

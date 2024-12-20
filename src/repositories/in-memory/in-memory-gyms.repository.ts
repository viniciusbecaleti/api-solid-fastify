import { Gym, Prisma } from '@prisma/client'
import { IGymsRepository } from '../gyms.repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/libs/getDistanceBetweenCoordinates'

export class InMemoryGymsRepository implements IGymsRepository {
  private gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description || null,
      phone: data.phone || null,
      latitude: new Prisma.Decimal(Number(data.latitude)),
      longitude: new Prisma.Decimal(Number(data.longitude))
    }

    this.gyms.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id) || null

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  async findManyNearby(userLatitude: number, userLongitude: number) {
    const gyms = this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: Number(gym.latitude), longitude: Number(gym.longitude) }
      )

      console.log(distance)

      return distance <= 10
    })

    return gyms
  }
}

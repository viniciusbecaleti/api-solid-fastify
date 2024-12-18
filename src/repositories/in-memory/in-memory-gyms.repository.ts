import { Gym, Prisma } from '@prisma/client'
import { IGymsRepository } from '../gyms.repository'
import { randomUUID } from 'node:crypto'

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
}

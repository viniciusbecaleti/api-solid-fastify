import type { Prisma, Gym } from '@prisma/client'

export interface IGymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(userLatitude: number, userLongitude: number): Promise<Gym[]>
}

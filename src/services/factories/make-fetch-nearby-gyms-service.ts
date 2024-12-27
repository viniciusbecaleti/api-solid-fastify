import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import { FetchNearbyGymsService } from '../fetch-nearby-gyms.service'

export function makeFetchNearbyGymsService() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const fetchNearbyGymsService = new FetchNearbyGymsService(
    prismaGymsRepository
  )

  return fetchNearbyGymsService
}

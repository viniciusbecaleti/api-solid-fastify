import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import { CreateGymService } from '../create-gym.service'

export function makeCreateGymService() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const createGymService = new CreateGymService(prismaGymsRepository)

  return createGymService
}

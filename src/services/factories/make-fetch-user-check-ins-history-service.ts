import { FetchUserCheckInsHistoryService } from '../fetch-user-check-ins-history.service'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository'

export function makeFetchUserCheckInHistoryService() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const fetchUserCheckInHistoryService = new FetchUserCheckInsHistoryService(
    prismaCheckInsRepository
  )

  return fetchUserCheckInHistoryService
}

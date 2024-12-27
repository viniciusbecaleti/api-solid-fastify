import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository'
import { GetUserMetricsService } from '../get-user-metrics.service'

export function makeGetUserMetricsService() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const getUserMetricsService = new GetUserMetricsService(
    prismaCheckInsRepository
  )

  return getUserMetricsService
}

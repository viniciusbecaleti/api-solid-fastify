import { expect, it, describe, beforeEach } from 'vitest'
import { FetchUserCheckInsHistoryService } from './fetch-user-check-ins-history.service'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryService

describe('Fetch User Check Ins History Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryService(checkInsRepository)
  })

  it('should be able fetch the user check ins history', async () => {
    await checkInsRepository.create({
      userId: 'user-01',
      gymId: 'gym-01'
    })

    await checkInsRepository.create({
      userId: 'user-01',
      gymId: 'gym-02'
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gymId: 'gym-01'
      }),
      expect.objectContaining({
        gymId: 'gym-02'
      })
    ])
  })

  it('should be able fetch the paginated user check ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        userId: 'user-01',
        gymId: `gym-${i}`
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gymId: 'gym-21'
      }),
      expect.objectContaining({
        gymId: 'gym-22'
      })
    ])
  })
})

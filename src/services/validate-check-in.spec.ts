import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { ValidateCheckInService } from './validate-check-in.service'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInService

describe('CheckIn Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInService(checkInsRepository)
  })

  it('should be able to validate a check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      userId: 'user-id',
      gymId: 'gym-id'
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    })

    expect(checkIn.validatedAt).toEqual(expect.any(Date))
    expect(checkInsRepository.checkIns[0].validatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'non-existent-check-in-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

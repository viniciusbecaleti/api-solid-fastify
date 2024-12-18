import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { CreateGymService } from './create-gym.service'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia Teste',
      description: null,
      latitude: -24.123456,
      longitude: -46.123456,
      phone: null
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})

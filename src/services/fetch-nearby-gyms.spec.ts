import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { FetchNearbyGymsService } from './fetch-nearby-gyms.service'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('FetchNearbyGymsService', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Academy',
      description: null,
      latitude: -22.32585359834157,
      longitude: -46.94050783811133,
      phone: null
    })

    await gymsRepository.create({
      title: 'TypeScript Academy',
      description: null,
      latitude: -22.334732310250804,
      longitude: -46.94988060358932,
      phone: null
    })

    await gymsRepository.create({
      title: 'Python Academy',
      description: null,
      latitude: -22.443733498162207,
      longitude: -46.96798709385856,
      phone: null
    })

    const { gyms } = await sut.execute({
      userLagitude: -22.3157104559978,
      userLongitude: -46.95179910342846
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Academy'
      }),
      expect.objectContaining({
        title: 'TypeScript Academy'
      })
    ])
  })
})

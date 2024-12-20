import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { SearchGymsService } from './search-gyms.service'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe('Search Gyms Service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsService(gymsRepository)
  })

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Academy',
      description: null,
      latitude: -24.123456,
      longitude: -46.123456,
      phone: null
    })

    await gymsRepository.create({
      title: 'TypeScript Academy',
      description: null,
      latitude: -24.123456,
      longitude: -46.123456,
      phone: null
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Academy'
      })
    ])
  })

  it('should be able to search paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Academy ${i}`,
        description: null,
        latitude: -24.123456,
        longitude: -46.123456,
        phone: null
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Academy 21'
      }),
      expect.objectContaining({
        title: 'JavaScript Academy 22'
      })
    ])
  })
})

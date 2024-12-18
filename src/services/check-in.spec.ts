import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { CheckInService } from './check-in.service'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { genSalt, hash } from 'bcryptjs'
import { Gym, User } from '@prisma/client'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.error'
import { MaxDistanceError } from './errors/max-distance.error'

let usersRepopository: InMemoryUsersRepository
let gymsRepository: InMemoryGymsRepository
let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInService
let user: User
let gym: Gym

describe('CheckIn Service', () => {
  beforeEach(async () => {
    usersRepopository = new InMemoryUsersRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInService(checkInsRepository, gymsRepository)

    const salt = await genSalt(10)
    const hashedPassword = await hash('123456', salt)

    user = await usersRepopository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      hashedPassword
    })

    gym = await gymsRepository.create({
      title: 'JavaScript Academy',
      latitude: -22.3091596,
      longitude: -46.95137
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create a check-in', async () => {
    const { checkIn } = await sut.execute({
      userId: user.id,
      gymId: gym.id,
      userLatitue: -22.3091596,
      userLongitude: -46.95137
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 11, 17, 11, 0, 0))

    await sut.execute({
      userId: user.id,
      gymId: gym.id,
      userLatitue: -22.3091596,
      userLongitude: -46.95137
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        gymId: gym.id,
        userLatitue: -22.3091596,
        userLongitude: -46.95137
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice in the different days', async () => {
    vi.setSystemTime(new Date(2024, 11, 16, 11, 0, 0))

    await sut.execute({
      userId: user.id,
      gymId: gym.id,
      userLatitue: -22.3091596,
      userLongitude: -46.95137
    })

    vi.setSystemTime(new Date(2024, 11, 17, 11, 0, 0))

    const { checkIn } = await sut.execute({
      userId: user.id,
      gymId: gym.id,
      userLatitue: -22.3091596,
      userLongitude: -46.95137
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    const gymFarAway = await gymsRepository.create({
      title: 'Far Away Academy',
      latitude: -22.3327408,
      longitude: -46.9504097
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        gymId: gymFarAway.id,
        userLatitue: -22.3091596,
        userLongitude: -46.95137
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { GetUserProfileService } from './get-user-profile.service'
import { genSalt, hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileService

describe('GetUserProfile Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  it('should return user profile', async () => {
    const salt = await genSalt(10)
    const hashedPassword = await hash('123456', salt)

    const { id: userId } = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      hashedPassword
    })

    const { user } = await sut.execute({ userId })

    expect(user.id).toBe(userId)
  })

  it('should throw ResourceNotFoundError when user does not exist', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-user-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

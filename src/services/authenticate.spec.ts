import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { AuthenticateService } from './authenticate.service'
import { genSalt, hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('should be able to authenticate a user', async () => {
    const salt = await genSalt(10)
    const hashedPassword = await hash('123456', salt)

    await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      hashedPassword
    })

    const { user } = await sut.execute({
      email: 'john@doe.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate a user with incorrect email', async () => {
    await expect(() =>
      sut.execute({
        email: 'jane@doe.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate a user with incorrect password', async () => {
    const salt = await genSalt(10)
    const hashedPassword = await hash('123456', salt)

    await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      hashedPassword
    })

    await expect(() =>
      sut.execute({
        email: 'john@doe.com',
        password: 'wrongpassword'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})

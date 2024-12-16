import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { describe, it, expect } from 'vitest'
import { AuthenticateService } from './authenticate.service'
import { genSalt, hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'

describe('Authenticate Service', () => {
  it('should be able to authenticate a user', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(inMemoryUsersRepository)

    const salt = await genSalt(10)
    const hashedPassword = await hash('123456', salt)

    await inMemoryUsersRepository.create({
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
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(inMemoryUsersRepository)

    await expect(() =>
      sut.execute({
        email: 'jane@doe.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate a user with incorrect password', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(inMemoryUsersRepository)

    const salt = await genSalt(10)
    const hashedPassword = await hash('123456', salt)

    await inMemoryUsersRepository.create({
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

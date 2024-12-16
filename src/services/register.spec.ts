import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterService } from './register.service'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { EmailAlreadyExistsError } from './errors/email-already-exists.error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  it('should be hash the user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.hashedPassword
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should be not able to register a user with an already used email', async () => {
    const email = 'john@doe.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should be able to register a user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })
})

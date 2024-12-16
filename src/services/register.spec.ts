import { expect, it, describe } from 'vitest'
import { RegisterService } from './register.service'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { EmailAlreadyExistsError } from './errors/email-already-exists.error'

describe('Register Service', () => {
  it('should be hash the user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.execute({
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
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const email = 'john@doe.com'

    await registerService.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })

    await expect(() =>
      registerService.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should be able to register a user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })
})

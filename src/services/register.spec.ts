import { expect, it, describe } from 'vitest'
import { RegisterService } from './register.service'
import { compare } from 'bcryptjs'

describe('Register Service', () => {
  it('should be hash the user password upon registration', async () => {
    const registerService = new RegisterService({
      async create({ name, email, hashedPassword }) {
        return {
          id: 'user-1',
          name,
          email,
          hashedPassword,
          role: 'USER',
          createdAt: new Date()
        }
      },

      async findByEmail() {
        return null
      }
    })

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456'
    })

    console.log(user)

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.hashedPassword
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})

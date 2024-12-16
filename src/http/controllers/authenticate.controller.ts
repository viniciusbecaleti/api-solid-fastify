import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { AuthenticateService } from '@/services/authenticate.service'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials.error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string()
  })

  const { email, password } = bodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const authenticateService = new AuthenticateService(prismaUsersRepository)

    const { user } = await authenticateService.execute({
      email,
      password
    })

    return reply.send({
      user
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: 'Invalid credentials'
      })
    }

    throw error
  }
}

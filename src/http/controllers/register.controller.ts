import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { EmailAlreadyExistsError } from '@/services/errors/email-already-exists.error'
import { RegisterService } from '@/services/register.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(usersRepository)
    await registerService.execute({ name, email, password })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message
      })
    }

    // TODO: fix me
    return reply.status(500).send({
      message: 'Internal server error'
    })
  }
}

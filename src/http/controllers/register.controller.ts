import { PrismaUsersRepository } from '@/repositories/prisma-users.repository'
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
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(prismaUsersRepository)
    await registerService.execute({ name, email, password })

    return reply.status(201).send()
  } catch (error) {
    console.error(error)
    return reply.status(409).send() // TODO: Handle error
  }
}

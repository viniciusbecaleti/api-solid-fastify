import { InvalidCredentialsError } from '@/services/errors/invalid-credentials.error'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'
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
    const authenticateService = makeAuthenticateService()

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

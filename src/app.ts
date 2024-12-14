import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from './libs/prisma'
import { genSalt, hash } from 'bcryptjs'

export const app = fastify()

app.post('/users', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const emailAlreadyExists = await prisma.user.findUnique({
    where: { email }
  })

  if (emailAlreadyExists) {
    reply.status(400).send({
      error: 'Email already exists'
    })
  }

  const salt = await genSalt(10)
  const hashedPassword = await hash(password, salt)

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword
    }
  })

  return reply.status(201).send()
})

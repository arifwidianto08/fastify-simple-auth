import jwtPlugin, { FastifyJWTOptions } from '@fastify/jwt'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

export { JWT } from '@fastify/jwt'

export type User = {
  id: string
  name: string
  email: string
  birthdate: string
  created_at: Date
  updated_at: Date
  iat: number
}

export const jwt: FastifyPluginAsync = fp<FastifyJWTOptions>(
  async (fastify: FastifyInstance) => {
    fastify.register(jwtPlugin, {
      secret: process.env.APP_JWT_SECRET,
    })
  },
)

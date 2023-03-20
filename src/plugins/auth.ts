import { FastifyPluginAsync, FastifyInstance } from 'fastify'
import fastifyAuth, { FastifyAuthFunction } from '@fastify/auth'
import fp from 'fastify-plugin'
import { getReasonPhrase } from 'http-status-codes'

declare module 'fastify' {
  interface FastifyInstance {
    asyncVerifyJWTandLevel: FastifyAuthFunction
  }
}

const asyncVerifyJWTandLevel: FastifyAuthFunction = async (
  request,
  reply,
  done,
) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.status(err.statusCode).send({
      message: err.message,
      statusCode: err.statusCode,
      error: getReasonPhrase(err.statusCode),
    })
    done()
  }
}

export const auth: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyAuth)
  fastify.decorate('asyncVerifyJWTandLevel', asyncVerifyJWTandLevel)
})

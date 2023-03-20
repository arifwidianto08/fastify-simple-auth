import { FastifyInstance, FastifyRequest } from 'fastify'
import * as controllers from '../controllers'
import { FastifyReply } from 'fastify'
import { IUpdateUser } from '../interfaces'
import { updateUserSchema } from '../schema'

async function userRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/profile',
    preValidation: fastify.auth([fastify.asyncVerifyJWTandLevel]),
    handler: (request: IUpdateUser, response: FastifyReply) => {
      return controllers.getProfile(request, response)
    },
  })
  fastify.route({
    method: 'PUT',
    url: '/profile',
    schema: updateUserSchema,
    preValidation: fastify.auth([fastify.asyncVerifyJWTandLevel]),
    handler: (request: IUpdateUser, response: FastifyReply) => {
      return controllers.updateProfile(request, response)
    },
  })
}

export default userRouter

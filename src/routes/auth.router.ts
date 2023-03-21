import { FastifyInstance } from 'fastify'
import {
  changePasswordSchema,
  forgotPasswordSchema,
  logInSchema,
  logInWithFirebaseSchema,
  resetPasswordSchema,
  registerSchema,
  setPasswordSchema,
} from '../schema'
import * as controllers from '../controllers'
import { FastifyReply } from 'fastify'
import {
  IChangePassword,
  IForgotPassword,
  ILogin,
  ILoginWithFirebase,
  IRegister,
  IResetPassword,
  ISetPassword,
} from '../interfaces'

async function authRouter(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/login',
    schema: logInSchema,
    handler: (request: ILogin, response: FastifyReply) => {
      return controllers.logIn(fastify.jwt, request, response)
    },
  })

  fastify.route({
    method: 'POST',
    url: '/login-with-firebase',
    schema: logInWithFirebaseSchema,
    handler: (request: ILoginWithFirebase, response: FastifyReply) => {
      return controllers.loginWithFirebase(fastify.jwt, request, response)
    },
  })

  fastify.route({
    method: 'POST',
    url: '/register',
    schema: registerSchema,
    handler: (request: IRegister, response: FastifyReply) => {
      return controllers.register(fastify.jwt, request, response)
    },
  })

  fastify.route({
    method: 'POST',
    url: '/forgot-password',
    schema: forgotPasswordSchema,
    handler: (request: IForgotPassword, response: FastifyReply) => {
      return controllers.forgotPassword(fastify.jwt, request, response)
    },
  })

  fastify.route({
    method: 'POST',
    url: '/reset-password',
    schema: resetPasswordSchema,
    handler: (request: IResetPassword, response: FastifyReply) => {
      return controllers.resetPassword(fastify.jwt, request, response)
    },
  })

  fastify.route({
    method: 'POST',
    url: '/set-password',
    schema: setPasswordSchema,
    preValidation: fastify.auth([fastify.asyncVerifyJWTandLevel]),
    handler: (request: ISetPassword, response: FastifyReply) => {
      return controllers.setPassword(request, response)
    },
  })

  fastify.route({
    method: 'PUT',
    url: '/change-password',
    schema: changePasswordSchema,
    preValidation: fastify.auth([fastify.asyncVerifyJWTandLevel]),
    handler: (request: IChangePassword, response: FastifyReply) => {
      return controllers.changePassword(request, response)
    },
  })
}

export default authRouter

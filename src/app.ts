require('dotenv').config()
import { utils } from './helpers/utils'
import fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import pino from 'pino'
import loadConfig from './config'
import { auth, jwt, firebase } from './plugins'
import authRouter from './routes/auth.router'
import userRouter from './routes/user.router'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

// loadConfig()

export const buildApp = async () => {
  try {
    const app = fastify({
      logger: pino({ level: 'info' }),
    })
    const jwtConfig = { secret: process.env.APP_JWT_SECRET }

    // Plugins
    app.register(require('@fastify/formbody'))
    app.register(require('@fastify/cors'))
    app.register(require('@fastify/helmet'))
    app.register(auth)
    app.register(jwt, jwtConfig)
    app.register(firebase)

    app.setErrorHandler(
      (error: FastifyError, _: FastifyRequest, reply: FastifyReply) => {
        app.log.error(error)
        if (error?.validation?.length) {
          reply.status(StatusCodes.BAD_REQUEST).send({
            message: error?.validation[0]?.message,
            statusCode: StatusCodes.BAD_REQUEST,
            error: ReasonPhrases.BAD_REQUEST,
          })
        }
      },
    )

    const PREFIX_PATH = '/api/v1'
    // Routes
    // ------------------------------------------------------
    // Auth
    // ------------------------------------------------------
    app.register(authRouter, {
      prefix: `${PREFIX_PATH}/auth`,
    })

    // ------------------------------------------------------
    // User
    // ------------------------------------------------------
    app.register(userRouter, {
      prefix: `${PREFIX_PATH}/user`,
    })

    // ------------------------------------------------------
    // App Health
    // ------------------------------------------------------
    app.get('/health-check', async (_: FastifyRequest, reply: FastifyReply) => {
      try {
        await utils.healthCheck()
        reply.status(200).send('Ping Pong')
      } catch (e) {
        reply.status(500).send()
      }
    })
    if (process.env.NODE_ENV === 'production') {
      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () =>
          app.close().then((err: Error) => {
            console.log(`close application on ${signal}`)
            process.exit(err ? 1 : 0)
          }),
        )
      }
    }

    return app
  } catch (e) {
    console.error(e)
  }
}

process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})

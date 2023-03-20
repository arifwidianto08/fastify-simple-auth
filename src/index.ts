import { utils } from './helpers/utils'
import fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import pino from 'pino'
import loadConfig from './config'
import { auth, jwt, firebase } from './plugins'
import authRouter from './routes/auth.router'
import userRouter from './routes/user.router'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

loadConfig()

const host = '127.0.0.1'
const port = process.env.API_PORT || 5000
const environment = process.env.NODE_ENV

const startServer = async () => {
  try {
    const server = fastify({
      logger: pino({ level: 'info' }),
    })
    const jwtConfig = { secret: process.env.APP_JWT_SECRET }

    // Plugins
    server.register(require('@fastify/formbody'))
    server.register(require('@fastify/cors'))
    server.register(require('@fastify/helmet'))
    server.register(auth)
    server.register(jwt, jwtConfig)
    server.register(firebase)

    server.setErrorHandler(
      (error: FastifyError, _: FastifyRequest, reply: FastifyReply) => {
        server.log.error(error)
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
    server.register(authRouter, {
      prefix: `${PREFIX_PATH}/auth`,
    })

    // ------------------------------------------------------
    // User
    // ------------------------------------------------------
    server.register(userRouter, {
      prefix: `${PREFIX_PATH}/user`,
    })

    // ------------------------------------------------------
    // App Health
    // ------------------------------------------------------
    server.get(
      '/health-check',
      async (_: FastifyRequest, reply: FastifyReply) => {
        try {
          await utils.healthCheck()
          reply.status(200).send('Ping Pong')
        } catch (e) {
          reply.status(500).send()
        }
      },
    )
    if (process.env.NODE_ENV === 'production') {
      for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, () =>
          server.close().then((err: Error) => {
            console.log(`close application on ${signal}`)
            process.exit(err ? 1 : 0)
          }),
        )
      }
    }

    await server.ready()
    server.log.info(
      '[Plugins]: All the plugins has been succesfully registered...',
    )

    server.listen({ port: Number(port), host }, (err, address) => {
      if (err) {
        server.log.error(err)
        process.exit(0)
      }

      if (environment !== 'production') {
        server.log.info(`Swagger for testing at: ${address} /documentation`)
      }
    })
  } catch (e) {
    console.error(e)
  }
}

process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})

startServer()

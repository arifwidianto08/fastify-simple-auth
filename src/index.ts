import { buildApp } from './app'

const startApp = async () => {
  const host = '127.0.0.1'
  const port = process.env.API_PORT || 5000
  const environment = process.env.NODE_ENV

  const app = await buildApp()

  await app.ready()
  app.log.info('[Plugins]: All the plugins has been successfully registered.')

  app.listen({ port: Number(port), host }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(0)
    }

    if (environment !== 'production') {
      app.log.info(`Swagger for testing at: ${address} /documentation`)
    }
  })
}

startApp()

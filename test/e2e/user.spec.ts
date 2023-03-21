import { FastifyInstance, FastifyTypeProviderDefault } from 'fastify'
import { IncomingMessage, Server, ServerResponse } from 'http'
import { Logger } from 'pino'
import { buildApp } from '../../src/app'
import { prisma } from '../../src/helpers/utils'

describe('Auth Endpoints', () => {
  const AUTH_URL = '/api/v1/auth'
  const USER_URL = '/api/v1/user'
  let app:
    | FastifyInstance<
        Server,
        IncomingMessage,
        ServerResponse,
        Logger<{
          level: string
        }>,
        FastifyTypeProviderDefault
      >
    | undefined

  let token: string

  beforeAll(async () => {
    app = await buildApp()

    const user = {
      email: 'test_another_user@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      birthdate: '2000-01-01',
      password: 'test-password-yea',
    }

    const registerResponse = await app?.inject({
      method: 'POST',
      url: `${AUTH_URL}/register`,
      payload: user,
    })
    const registerResponseJson = registerResponse?.json()
    token = registerResponseJson.token
  })

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: 'test_another_user@gmail.com',
      },
    })
    await app?.close()
  })

  it('Successfully retrieve user profile', async () => {
    const payload = {
      email: 'failed-test@gmail.com',
      password: 'test123456789',
    }

    const response = await app?.inject({
      method: 'GET',
      url: `${USER_URL}/profile`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload,
    })

    const json = response?.json()
    expect(json).toMatchObject({
      id: expect.any(Number),
      email: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      birthdate: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
    expect(response?.statusCode).toBe(200)
  })

  it('Successfully update user profile', async () => {
    const payload = {
      firstName: 'Test Update',
      lastName: 'Profile User',
      birthdate: '2000-02-02',
    }

    const response = await app?.inject({
      method: 'PUT',
      url: `${USER_URL}/profile`,
      payload,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    const json = response?.json()
    expect(json).toMatchObject({
      id: expect.any(Number),
      email: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      birthdate: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
    expect(response?.statusCode).toBe(200)
  })
})

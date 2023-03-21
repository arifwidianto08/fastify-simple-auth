import { FastifyInstance, FastifyTypeProviderDefault } from 'fastify'
import { IncomingMessage, Server, ServerResponse } from 'http'
import { Logger } from 'pino'
import { buildApp } from '../../src/app'
import { prisma } from '../../src/helpers/utils'

describe('Auth Endpoints', () => {
  const AUTH_URL = '/api/v1/auth'
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
  })

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        email: 'test@gmail.com',
      },
    })
    await app?.close()
  })

  it('Register successfully', async () => {
    const payload = {
      email: 'test@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      birthdate: '2000-01-01',
      password: 'test123456789',
    }

    const response = await app?.inject({
      method: 'POST',
      url: `${AUTH_URL}/register`,
      payload,
    })

    const json = response?.json()
    expect(json.token.length).toBeTruthy()
    expect(json.user).toMatchObject({
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

  it('return error bad request on register because of missing field', async () => {
    const payload = {
      firstName: 'Test Update',
      lastName: 'Profile User',
      birthdate: '2000-02-02',
    }

    const response = await app?.inject({
      method: 'POST',
      url: `${AUTH_URL}/register`,
      payload,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    const json = response?.json()
    expect(json?.error).toBe('Bad Request')
    expect(response?.statusCode).toBe(400)
  })

  it('Login successfully', async () => {
    const payload = {
      email: 'test@gmail.com',
      password: 'test123456789',
    }

    const response = await app?.inject({
      method: 'POST',
      url: `${AUTH_URL}/login`,
      payload,
    })

    const json = response?.json()

    expect(json.token.length).toBeTruthy()
    expect(json.user).toMatchObject({
      id: expect.any(Number),
      email: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      birthdate: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
    expect(response?.statusCode).toBe(200)

    token = json.token
  })

  it('Failed to login due to incorrect credentials', async () => {
    const payload = {
      email: 'failed-test@gmail.com',
      password: 'test123456789',
    }

    const response = await app?.inject({
      method: 'POST',
      url: `${AUTH_URL}/login`,
      payload,
    })

    const json = response?.json()
    expect(json?.error).toBe('Unauthorized')
    expect(response?.statusCode).toBe(401)
  })

  it('Successfully change password', async () => {
    const payload = {
      oldPassword: 'test123456789',
      newPassword: 'testChangePassword123456789',
    }

    const response = await app?.inject({
      method: 'PUT',
      url: `${AUTH_URL}/change-password`,
      payload,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    const json = response?.json()

    expect(json?.message).toBe('Password is successfully changed')
    expect(response?.statusCode).toBe(200)
  })

  it('Successfully sent forgot password email', async () => {
    const payload = {
      email: 'test@gmail.com',
    }

    const response = await app?.inject({
      method: 'POST',
      url: `${AUTH_URL}/forgot-password`,
      payload,
    })

    const json = response?.json()
    expect(json?.message).toBe(
      'Reset link sent successfully ( also don`t forget to check your Spam section. )',
    )
    expect(response?.statusCode).toBe(200)
  })

  it('Successfully reset password', async () => {
    const payload = {
      token,
      password: 'wahbangetgasih123',
    }

    const response = await app?.inject({
      method: 'POST',
      url: `${AUTH_URL}/reset-password`,
      payload,
    })

    const json = response?.json()
    expect(json?.message).toBe('Password has been successfully reset')
    expect(response?.statusCode).toBe(200)
  })
})

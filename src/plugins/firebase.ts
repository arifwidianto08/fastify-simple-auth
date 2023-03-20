import { FastifyPluginAsync, FastifyInstance } from 'fastify'
import fastifyAuth, { FastifyAuthFunction } from '@fastify/auth'
import fp from 'fastify-plugin'
import { initializeApp, cert } from 'firebase-admin/app'
const firebaseServiceAccount = require('../config/firebase.json')

declare module 'fastify' {
  interface FastifyInstance {
    firebase: FastifyAuthFunction
  }
}

export const firebase: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
    // We need to check if this name is already being used
    if (fastify.firebase) {
      throw new Error(`firebase already registered`)
    }

    initializeApp({
      credential: cert(firebaseServiceAccount),
    })
  },
)

import { FastifyRequest } from 'fastify'
import { Prisma, User } from '@prisma/client'

export type IUser = Omit<User, 'password'>

export interface IUpdateUser extends FastifyRequest {
  body: Pick<User, 'firstName' | 'lastName' | 'birthdate'>
}

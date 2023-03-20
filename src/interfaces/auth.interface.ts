import { FastifyRequest } from 'fastify'
import { Prisma, User } from '@prisma/client'

export interface IRegister extends FastifyRequest {
  body: Prisma.UserCreateInput
  authUser: User
}

export interface ILogin extends FastifyRequest {
  body: {
    email: string
    password: string
  }
}

export interface IForgotPassword extends FastifyRequest {
  body: {
    email: string
  }
}

export interface IResetPassword extends FastifyRequest {
  body: {
    password: string
    token: string
  }
}

export interface ILoginWithFirebase extends FastifyRequest {
  body: {
    token: string
  }
}

export interface IUserAuthToken {
  id: number
  email: string
}

export interface ISetPassword extends FastifyRequest {
  body: {
    password: string
  }
}

export interface IChangePassword extends FastifyRequest {
  body: {
    oldPassword: string
    newPassword: string
  }
}

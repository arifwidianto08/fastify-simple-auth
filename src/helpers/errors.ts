import { FastifyReply } from 'fastify'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export const ERRORS = {
  invalidToken: new Error('Token is invalid.'),
  userExists: new Error('User already exists'),
  userNotExists: new Error('User not exists'),
  userCredError: new Error('Invalid credential'),
  tokenError: new Error('Invalid Token'),
}

export function handleServerError(reply: FastifyReply, error: any) {
  return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    error: ReasonPhrases.INTERNAL_SERVER_ERROR,
  })
}

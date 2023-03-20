import { FastifyReply } from 'fastify'
import { handleServerError } from '../helpers/errors'
import { StatusCodes } from 'http-status-codes'
import { prisma } from '../helpers/utils'
import { IUpdateUser, IUser } from '../interfaces'

export const getProfile = async (request: IUpdateUser, reply: FastifyReply) => {
  try {
    console.log('Terlalu WIKWOKKK')
    const userFromToken = request.user as IUser
    const user = await prisma.user.findFirst({
      where: { id: userFromToken.id },
    })

    delete user.password

    reply.status(StatusCodes.OK).send(user)
  } catch (e) {
    handleServerError(reply, e)
  }
}

export const updateProfile = async (
  request: IUpdateUser,
  reply: FastifyReply,
) => {
  try {
    const { firstName, lastName, birthdate } = request.body
    const userFromToken = request.user as IUser

    const profile = await prisma.user.update({
      where: {
        id: userFromToken.id,
      },
      data: {
        firstName,
        lastName,
        birthdate: new Date(birthdate),
      },
    })

    delete profile.password

    reply.status(StatusCodes.OK).send(profile)
  } catch (e) {
    handleServerError(reply, e)
  }
}

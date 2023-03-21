import { FastifyReply, FastifyRequest } from 'fastify'
import { handleServerError } from '../helpers/errors'
import { prisma, utils } from '../helpers/utils'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import {
  IForgotPassword,
  ILoginWithFirebase,
  IResetPassword,
  ILogin,
  IRegister,
  IUserAuthToken,
  IChangePassword,
  ISetPassword,
  IUser,
} from '../interfaces'
import { JWT } from '@fastify/jwt'
import { sendEmail } from '../helpers/email-sender'
import { auth } from 'firebase-admin'

export const logIn = async (jwt: JWT, request: ILogin, reply: FastifyReply) => {
  try {
    const { email, password } = request.body
    const user = await prisma.user.findUnique({ where: { email: email } })
    if (!user) {
      reply.code(StatusCodes.UNAUTHORIZED).send({
        message: 'Invalid Email.',
        statusCode: StatusCodes.UNAUTHORIZED,
        error: ReasonPhrases.UNAUTHORIZED,
      })
    }

    const checkPass = await utils.compareHash(password, user.password)
    if (!checkPass) {
      reply.code(StatusCodes.UNAUTHORIZED).send({
        message: 'Invalid Email and Password combination.',
        statusCode: StatusCodes.UNAUTHORIZED,
        error: ReasonPhrases.UNAUTHORIZED,
      })
    }

    delete user.password

    const token = jwt.sign(user)
    reply.code(StatusCodes.OK).send({
      token,
      user,
    })
  } catch (err) {
    handleServerError(reply, err)
  }
}

export const register = async (
  jwt: JWT,
  request: IRegister,
  reply: FastifyReply,
) => {
  try {
    const { email, password, firstName, lastName, birthdate } = request.body

    const user = await prisma.user.findUnique({ where: { email: email } })
    if (user) {
      reply.code(StatusCodes.CONFLICT).send({
        message: 'User already exists.',
        statusCode: StatusCodes.CONFLICT,
        error: ReasonPhrases.CONFLICT,
      })
    }

    const hashPass = await utils.genSalt(10, password)
    const createdUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        birthdate: new Date(birthdate),
        password: String(hashPass),
      },
    })

    delete createdUser.password

    const token = jwt.sign({
      id: createdUser.id,
      email: createdUser.email,
    })

    reply.code(StatusCodes.OK).send({
      token,
      user: createdUser,
    })
  } catch (err) {
    handleServerError(reply, err)
  }
}

export const loginWithFirebase = async (
  jwt: JWT,
  request: ILoginWithFirebase,
  reply: FastifyReply,
) => {
  try {
    const { token } = request.body
    const validToken = await auth()
      .verifyIdToken(token)
      .catch(() => {
        return null
      })

    if (!validToken) {
      reply.code(StatusCodes.UNAUTHORIZED).send({
        message: 'Invalid token',
        statusCode: StatusCodes.UNAUTHORIZED,
        error: ReasonPhrases.UNAUTHORIZED,
      })
    }

    const { email, uid } = validToken
    const { displayName } = await auth().getUser(uid)
    const splittedName = displayName?.split(' ')
    const firstName = splittedName[0]
    const lastName = splittedName[splittedName.length - 1] || ''

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      const createdUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
        },
      })

      delete createdUser.password

      reply.code(StatusCodes.OK).send({
        token: jwt.sign({
          id: createdUser.id,
          email: createdUser.email,
        }),
        user: createdUser,
      })
    }

    delete user.password

    reply.code(StatusCodes.OK).send({
      token: jwt.sign({
        id: user.id,
        email: user.email,
      }),
      user,
    })
  } catch (e) {
    // handleServerError(reply, e)
  }
}

export const forgotPassword = async (
  jwt: JWT,
  request: IForgotPassword,
  reply: FastifyReply,
) => {
  try {
    const { email } = request.body
    const user = await prisma.user.findUnique({ where: { email: email } })
    if (!user) {
      reply.code(StatusCodes.UNAUTHORIZED).send({
        message: 'Invalid Email.',
        statusCode: StatusCodes.UNAUTHORIZED,
        error: ReasonPhrases.UNAUTHORIZED,
      })
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: null,
      },
    })

    const token = jwt.sign({
      id: user.id,
      email: user.email,
    })

    const link = process.env.RESET_PASSWORD_URL + `?${token}`
    const subject = 'Reset Password Requested'
    const html =
      '<body><p>Please reset your password.</p> <a href=' +
      link +
      '>Reset Password</a></body>'
    const text = 'Reset Password has been requsted.'

    //Passing the details of the email to a function allows us to generalize the email sending function
    await sendEmail({
      to: email,
      subject,
      html,
      text,
    })

    reply.status(StatusCodes.OK).send({
      message:
        'Reset link sent successfully ( also don`t forget to check your Spam section. )',
    })
  } catch (e) {
    handleServerError(reply, e)
  }
}

export const resetPassword = async (
  jwt: JWT,
  request: IResetPassword,
  reply: FastifyReply,
) => {
  try {
    const { token, password } = request.body
    const decodedToken = jwt.verify(token) as IUserAuthToken
    const user = await prisma.user.findUnique({
      where: { email: decodedToken.email },
    })

    if (!user) {
      reply.code(StatusCodes.NOT_FOUND).send({
        message: 'User not exists.',
        statusCode: StatusCodes.NOT_FOUND,
        error: ReasonPhrases.NOT_FOUND,
      })
    }

    if (user.password) {
      reply.code(StatusCodes.UNAUTHORIZED).send({
        message: 'Invalid token',
        statusCode: StatusCodes.UNAUTHORIZED,
        error: ReasonPhrases.UNAUTHORIZED,
      })
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password,
      },
    })

    reply
      .status(StatusCodes.OK)
      .send({ message: 'Password has been successfully reset' })
  } catch (e) {
    handleServerError(reply, e)
  }
}

export const setPassword = async (
  request: ISetPassword,
  reply: FastifyReply,
) => {
  try {
    const { password } = request.body
    const userFromToken = request.user as IUser
    const currentUserData = await prisma.user.findUnique({
      where: { email: userFromToken.email },
    })

    if (currentUserData.password) {
      reply.code(StatusCodes.CONFLICT).send({
        message: 'Password already being set. Try to change password instead.',
        statusCode: StatusCodes.CONFLICT,
        error: ReasonPhrases.CONFLICT,
      })
    }

    const hashedNewPassword = await utils.genSalt(10, password)
    await prisma.user.update({
      where: {
        id: userFromToken.id,
      },
      data: {
        password: hashedNewPassword,
      },
    })

    reply
      .status(StatusCodes.OK)
      .send({ message: 'Password changed successfully' })
  } catch (e) {
    handleServerError(reply, e)
  }
}

export const changePassword = async (
  request: IChangePassword,
  reply: FastifyReply,
) => {
  try {
    const { oldPassword, newPassword } = request.body
    const userFromToken = request.user as IUser
    const currentUserData = await prisma.user.findUnique({
      where: { email: userFromToken.email },
    })

    const checkOldPass = await utils.compareHash(
      oldPassword,
      currentUserData.password,
    )
    if (!checkOldPass) {
      reply.code(StatusCodes.UNAUTHORIZED).send({
        message: 'Invalid Old Password.',
        statusCode: StatusCodes.UNAUTHORIZED,
        error: ReasonPhrases.UNAUTHORIZED,
      })
    }

    const hashedNewPassword = await utils.genSalt(10, newPassword)
    await prisma.user.update({
      where: {
        id: userFromToken.id,
      },
      data: {
        password: hashedNewPassword,
      },
    })

    reply
      .status(StatusCodes.OK)
      .send({ message: 'Password is successfully changed' })
  } catch (e) {
    handleServerError(reply, e)
  }
}

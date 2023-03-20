import S from 'fluent-json-schema'
import { addErrorSchemas } from './shared.schema'

// Login
export const logInResponseSchema = S.object()
    .prop('token', S.string().required())
    .prop(
        'user',
        S.object()
            .prop('id', S.number().required())
            .prop('email', S.string().format(S.FORMATS.EMAIL).required())
            .prop('firstName', S.string().required())
            .prop('lastName', S.string().required())
            .prop(
                'birthdate',
                S.raw({ type: 'string', format: 'date', formatMaximum: '2020-01-01' }),
            )
            .prop('createdAt', S.string().required())
            .prop('updatedAt', S.string().required()),
    )

export const logInSchema = {
    body: S.object()
        .prop('email', S.string().format(S.FORMATS.EMAIL).required())
        .prop('password', S.string().minLength(8).required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
    response: addErrorSchemas({ 200: logInResponseSchema }),
}

// Login with Firebase
export const logInWithFirebaseSchema = {
    body: S.object().prop('token', S.string().required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
    response: addErrorSchemas({ 200: logInResponseSchema }),
}

// Register
export const registerResponseSchema = S.object()
    .prop('token', S.string().required())
    .prop(
        'user',
        S.object()
            .prop('id', S.number().required())
            .prop('email', S.string().format(S.FORMATS.EMAIL).required())
            .prop('firstName', S.string().required())
            .prop('lastName', S.string().required())
            .prop(
                'birthdate',
                S.raw({ type: 'string', format: 'date', formatMaximum: '2020-01-01' }),
            )
            .prop('createdAt', S.string().required())
            .prop('updatedAt', S.string().required()),
    )

export const registerSchema = {
    body: S.object()
        .prop('email', S.string().format(S.FORMATS.EMAIL).required())
        .prop('firstName', S.string().required())
        .prop('lastName', S.string().required())
        .prop(
            'birthdate',
            S.raw({ type: 'string', format: 'date', formatMaximum: '2020-01-01' }),
        )
        .prop('password', S.string().minLength(8).required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
    response: addErrorSchemas({ 200: registerResponseSchema }),
}

// Forgot Password
export const forgotPasswordSchema = {
    body: S.object().prop('email', S.string().format(S.FORMATS.EMAIL).required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
    response: addErrorSchemas({
        200: S.object().prop('message', S.string().required()),
    }),
}

// Reset Password
export const resetPasswordSchema = {
    body: S.object()
        .prop('password', S.string().minLength(5).required())
        .prop('token', S.string().required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
}

// Set Password
export const setPasswordSchema = {
    body: S.object().prop('password', S.string().minLength(5).required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
    response: addErrorSchemas({
        200: S.object().prop('message', S.string().required()),
    }),
}

// Change Password
export const changePasswordSchema = {
    body: S.object()
        .prop('newPassword', S.string().minLength(5).required())
        .prop('oldPassword', S.string().required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
    response: addErrorSchemas({
        200: S.object().prop('message', S.string().required()),
    }),
}

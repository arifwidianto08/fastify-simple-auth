import S from 'fluent-json-schema'
import { addErrorSchemas } from './shared.schema'

// Profile
export const getAndUpdateProfileResponseSchema = S.object()
    .prop('id', S.number().required())
    .prop('email', S.string().format(S.FORMATS.EMAIL).required())
    .prop('firstName', S.string().required())
    .prop('lastName', S.string().required())
    .prop(
        'birthdate',
        S.raw({ type: 'string', format: 'date', formatMaximum: '2020-01-01' }),
    )
    .prop('createdAt', S.string().required())
    .prop('updatedAt', S.string().required())

export const updateUserSchema = {
    body: S.object()
        .prop('firstName', S.string().required())
        .prop('lastName', S.string().required())
        .prop(
            'birthdate',
            S.raw({ type: 'string', format: 'date', formatMaximum: '2020-01-01' }),
        ),
    queryString: S.object(),
    params: S.object(),
    headers: S.object(),
    response: addErrorSchemas({ 200: getAndUpdateProfileResponseSchema }),
}

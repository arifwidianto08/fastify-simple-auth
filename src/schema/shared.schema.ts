import S from 'fluent-json-schema'

export const errorSchema = S.object()
  .prop('error', S.string())
  .prop('message', S.string())
  .prop('statusCode', S.number())

export function addErrorSchemas(responseSchema: object): object {
  return {
    ...responseSchema,
    400: errorSchema,
    500: errorSchema,
  }
}

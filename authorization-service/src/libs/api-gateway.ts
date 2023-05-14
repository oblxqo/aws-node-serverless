import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
import { RESPONSE_HEADERS } from '@constants/http.constant';
import { StatusCode } from '@enums/status-code.enum';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export const formatJSONResponse = (response: Record<string, unknown>, statusCode = StatusCode.OK) => {
  return {
    statusCode,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify(response)
  };
};

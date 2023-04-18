import { APIGatewayEvent } from "aws-lambda";
import { Schema } from "yup";
import { STATUS_MESSAGES } from "@constants/http.constant";
import { StatusCode } from "@enums/status-code.enum";

interface EventSchemaParams {
  event: APIGatewayEvent;
  schema: Schema;
}

export const validateRequest = async (params: EventSchemaParams) => {
  const { event, schema } = params;
  const validateOptions = { strict: true, stripUnknown: true };

  console.info('In validateRequest >>> event: ', JSON.stringify(event));
  try {
    return await schema.validate(event.body, validateOptions);
  } catch (error) {
    const message = error.message || STATUS_MESSAGES[StatusCode.BAD_REQUEST];
    console.error(`In validateRequest >>> error message: ${message}`);
    throw {
      statusCode: StatusCode.BAD_REQUEST,
      message,
      errorInstance: error
    };
  }
};
import { APIGatewayEvent } from "aws-lambda";
import { Schema } from "yup";
import { STATUS_MESSAGES } from "@constants/http.constant";
import { StatusCode } from "@enums/status-code.enum";
import { SQSRecord } from "aws-lambda/trigger/sqs";

interface EventSchemaParams {
  event: APIGatewayEvent | SQSRecord;
  schema: Schema;
}

export const validateRequest = async (params: EventSchemaParams) => {
  const { event, schema } = params;
  const validateOptions = { strict: true, stripUnknown: true };
  let eventBody = event.body;

  console.info('In validateRequest >>> event: ', JSON.stringify(event));
  if ('receiptHandle' in event) {
    eventBody = JSON.parse(event.body);
  }
  try {
    const coercedData = await schema.cast(eventBody);
    console.info('In validateRequest >>> coercedData: ', coercedData);
    await schema.validate(coercedData, validateOptions);
    return coercedData;
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
import { StatusCode } from '@enums/status-code.enum';
import { Status } from '@enums/status.enum';
import { ResponseHeader } from "@models/http.model";

export const STATUS_MESSAGES = {
  [StatusCode.OK]: Status.SUCCESS,
  [StatusCode.CREATED]: Status.CREATED,
  [StatusCode.BAD_REQUEST]: Status.BAD_REQUEST,
  [StatusCode.NOT_FOUND]: Status.NOT_FOUND,
  [StatusCode.ERROR]: Status.ERROR
};

export const RESPONSE_HEADERS: ResponseHeader = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};

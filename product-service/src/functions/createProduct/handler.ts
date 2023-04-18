import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { ProductSchema } from './schema';
import { ERROR_CODES } from '@constants/error-codes';
import { StatusCode } from '@enums/status-code.enum';
import { productService } from '@services/index';
import { validateRequest } from "../../helpers/validate-request.helper";
import { STATUS_MESSAGES } from "@constants/http.constant";
import { ValidationError } from "yup";

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof ProductSchema> = async event => {
  const productBody = event.body;

  console.log('In createProduct >>> request: event ', event);

  try {
    await validateRequest({ event, schema: ProductSchema });

    const product = await productService.createProduct(productBody);

    console.log('In createProduct >>> new product is created: ', product);
    return formatJSONResponse({ payload: product }, StatusCode.CREATED);
  } catch (error) {
    if (error.errorInstance instanceof ValidationError) {
      return formatJSONResponse(
        {
          status: ERROR_CODES.validationError,
          message: error.message
        },
        StatusCode.BAD_REQUEST
      );
    }
    return formatJSONResponse(
      {
        status: ERROR_CODES.internalServerError,
        message: error.message || STATUS_MESSAGES[StatusCode.ERROR]
      },
      StatusCode.ERROR
    );
  }
};

export const main = middyfy(createProduct);

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { MESSAGES } from '@constants/messages';
import { ERROR_CODES } from '@constants/error-codes';
import { StatusCode } from '@enums/status-code.enum';
import { productService } from '@services/index';

export const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async event => {
  const { productId } = event.pathParameters;

  console.log('In getProductsById >>> request: event ', event);
  try {
    const product = await productService.getProductById(productId);

    if (!product) {
      return formatJSONResponse(
        {
          status: ERROR_CODES.productNotFound,
          message: MESSAGES[ERROR_CODES.productNotFound]
        },
        StatusCode.NOT_FOUND
      );
    }
    return formatJSONResponse({ payload: product });
  } catch (error) {
    return formatJSONResponse(
      {
        status: ERROR_CODES.internalServerError,
        message: error
      },
      StatusCode.ERROR
    );
  }
};

export const main = middyfy(getProductsById);

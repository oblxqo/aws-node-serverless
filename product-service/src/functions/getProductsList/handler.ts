import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { MESSAGES } from '@constants/messages';
import { ERROR_CODES } from '@constants/error-codes';
import { StatusCode } from '@enums/status-code.enum';
import { productService } from '@services/index';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<unknown> = async event => {
  console.log('In getProductsList >>> request: event ', event);

  try {
    const products = await productService.getProductsWithStocks();

    if (!products.length) {
      return formatJSONResponse(
        {
          status: ERROR_CODES.productsNotFound,
          message: MESSAGES[ERROR_CODES.productsNotFound]
        },
        StatusCode.NOT_FOUND
      );
    }
    return formatJSONResponse({ payload: products });
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

export const main = middyfy(getProductsList);

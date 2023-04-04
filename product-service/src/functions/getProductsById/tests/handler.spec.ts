import { formatJSONResponse } from '@libs/api-gateway';
import { mockProducts } from '@mocks/products.mock';
import { getProductsById } from '@functions/getProductsById/handler';
import { ERROR_CODES } from '@constants/error-codes';
import { MESSAGES } from '@constants/messages';
import { StatusCode } from '@enums/status-code.enum';

describe('getProductsById handler', function () {
  it('should return successful response with product', async () => {
    const event: any = {
      pathParameters: {
        productId: 'c293793b-7b83-4777-b9a0-c5d5f2fc92eb'
      }
    } as any;
    const result = await getProductsById(event, null, null);

    expect(result).toEqual(formatJSONResponse({ payload: mockProducts[0] }));
  });

  it('should throw NOT_FOUND error if productId is invalid', async () => {
    const event: any = {
      pathParameters: {
        productId: '421'
      }
    } as any;
    const result = await getProductsById(event, null, null);

    expect(result).toEqual(
      formatJSONResponse(
        {
          status: ERROR_CODES.productNotFound,
          message: MESSAGES[ERROR_CODES.productNotFound]
        },
        StatusCode.NOT_FOUND
      )
    );
  });

  it('should throw NOT_FOUND error if pathParameters is empty', async () => {
    const event: any = {
      pathParameters: {}
    } as any;
    const result = await getProductsById(event, null, null);

    expect(result).toEqual(
      formatJSONResponse(
        {
          status: ERROR_CODES.productNotFound,
          message: MESSAGES[ERROR_CODES.productNotFound]
        },
        StatusCode.NOT_FOUND
      )
    );
  });
});

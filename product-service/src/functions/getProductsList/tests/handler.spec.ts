import { getProductsList } from '@functions/getProductsList/handler';
import { formatJSONResponse } from '@libs/api-gateway';
import { mockProducts } from '@mocks/products.mock';

describe('getProductsList handler', function () {
  it('should verifies successful response', async () => {
    const result = await getProductsList(null, null, null);

    expect(result).toEqual(formatJSONResponse({ payload: mockProducts }));
  });
});

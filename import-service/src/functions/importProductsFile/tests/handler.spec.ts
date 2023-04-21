import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { importProductsFile } from '@functions/importProductsFile/handler';
import { formatJSONResponse } from '@libs/api-gateway';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ERROR_CODES } from '@constants/error-codes';
import { MESSAGES } from '@constants/messages';
import { StatusCode } from '@enums/status-code.enum';

const s3Mock = mockClient(S3Client);
jest.mock('@aws-sdk/s3-request-presigner');

describe('importProductsFile handler', () => {
  let mockEvent: any;
  const fileName = 'products-1.csv';
  const signedUrl = 'signedUrl';

  beforeEach(() => {
    mockEvent = {
      queryStringParameters: {
        name: fileName
      }
    };
    s3Mock.on(PutObjectCommand).resolves({});
  });

  afterEach(() => {
    s3Mock.reset();
    jest.resetAllMocks();
  });

  it('should return response with signed URL', async () => {
    (getSignedUrl as jest.Mock).mockImplementation(() => Promise.resolve(signedUrl));
    const result = await importProductsFile(mockEvent, null, null);

    expect(result).toEqual(formatJSONResponse({ payload: 'signedUrl' }));
  });

  it('should return response with invalidFileFormatError', async () => {
    mockEvent.queryStringParameters.name = null;
    const result = await importProductsFile(mockEvent, null, null);

    expect(result).toEqual(
      formatJSONResponse(
        {
          status: ERROR_CODES.invalidFileFormatError,
          message: MESSAGES[ERROR_CODES.invalidFileFormatError]
        },
        StatusCode.BAD_REQUEST
      )
    );
  });

  it('should return internalServerError', async () => {
    const errorMock = 'errorMock';
    (getSignedUrl as jest.Mock).mockImplementation(() => Promise.reject(errorMock));
    const result = await importProductsFile(mockEvent, null, null);

    expect(result).toEqual(
      formatJSONResponse(
        {
          status: ERROR_CODES.internalServerError,
          message: errorMock
        },
        StatusCode.ERROR
      )
    );
  });
});

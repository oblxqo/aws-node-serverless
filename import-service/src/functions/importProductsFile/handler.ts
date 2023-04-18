import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ERROR_CODES } from '@constants/error-codes';
import { MESSAGES } from '@constants/messages';
import { StatusCode } from '@enums/status-code.enum';
import { s3ClientParams } from '@constants/s3-client-params';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async event => {
	console.log('In importProductsFile >>> request: event ', event);
	console.log('In importProductsFile >>> request: event.queryStringParameters ', event.queryStringParameters);
	const s3Client = new S3Client({ region: s3ClientParams.REGION });
	const fileName = event.queryStringParameters.name;

	if (!fileName) {
		return formatJSONResponse(
			{
				status: ERROR_CODES.invalidFileFormatError,
				message: MESSAGES[ERROR_CODES.invalidFileFormatError]
			},
			StatusCode.BAD_REQUEST
		);
	}

	try {
		const putCommand = new PutObjectCommand({
			Bucket: s3ClientParams.UPLOAD_BUCKET_NAME,
			Key: `${s3ClientParams.UPLOAD_BASE_PATH}${fileName}`,
			ContentType: s3ClientParams.CONTENT_TYPE_CSV
		});
		const putSignedUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: s3ClientParams.EXPIRE_PERIOD });

		console.log('In importProductsFile putSignedUrl', putSignedUrl);

		return formatJSONResponse({ payload: putSignedUrl });
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

export const main = middyfy(importProductsFile);

import 'aws-sdk-client-mock-jest';
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import { createReadStream } from 'fs';
import { join } from 'path';
import { s3ClientParams } from '@constants/s3-client-params';
import { importFileParser } from '@functions/importFileParser/handler';

describe('importFileParser handler', () => {
	const mockS3Client = mockClient(S3Client);
	const objectKey = 'uploaded/products-1.csv';

	const mockEvent: any = {
		Records: [
			{
				s3: {
					bucket: {
						name: s3ClientParams.UPLOAD_BUCKET_NAME
					},
					object: {
						key: objectKey
					}
				}
			}
		]
	};

	const copyObjectCommandMock = {
		Bucket: s3ClientParams.UPLOAD_BUCKET_NAME,
		CopySource: `${s3ClientParams.UPLOAD_BUCKET_NAME}/${objectKey}`,
		Key: objectKey.replace(s3ClientParams.UPLOAD_BASE_PATH, s3ClientParams.PARSE_BASE_PATH)
	};

	const deleteObjectCommandMock = {
		Bucket: s3ClientParams.UPLOAD_BUCKET_NAME,
		Key: objectKey
	};

	beforeEach(() => {
		mockS3Client.on(GetObjectCommand).resolves({
			Body: sdkStreamMixin(createReadStream(join(__dirname, '../../../mocks/products-1.csv')))
		});
	});

	afterEach(() => {
		mockS3Client.reset();
		jest.resetAllMocks();
	});

	it('should parse file and copy', async () => {
		await importFileParser(mockEvent, null, null);

		expect(mockS3Client).toHaveReceivedCommand(GetObjectCommand);
		expect(mockS3Client).toHaveReceivedCommandWith(CopyObjectCommand, copyObjectCommandMock);
		expect(mockS3Client).toHaveReceivedCommandWith(DeleteObjectCommand, deleteObjectCommandMock);
	});
});

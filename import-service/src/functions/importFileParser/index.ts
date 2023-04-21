import { handlerPath } from '@libs/handler-resolver';
import { s3ClientParams } from '@constants/s3-client-params';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			s3: {
				bucket: s3ClientParams.UPLOAD_BUCKET_NAME,
				event: 's3:ObjectCreated:*',
				existing: true,
				rules: [
					{
						prefix: s3ClientParams.UPLOAD_BASE_PATH
					},
					{ suffix: 'csv' }
				]
			}
		}
	]
};

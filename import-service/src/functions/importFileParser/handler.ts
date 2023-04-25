import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3Handler } from 'aws-lambda/trigger/s3';
import csvParser from 'csv-parser';
import { s3ClientParams } from '@constants/s3-client-params';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { importServiceConfig } from '../../configs/import-service.config';

export const importFileParser: S3Handler = async event => {
  console.log('In importProductsFile >>> request: event ', event);
  const s3Client = new S3Client({ region: s3ClientParams.REGION });
  const sqsClient = new SQSClient({ region: s3ClientParams.REGION });

  try {
    const readFile = async (bucket, key) => {
      const params = {
        Bucket: bucket,
        Key: key
      };
      const getFileCommand = new GetObjectCommand(params);
      return await s3Client.send(getFileCommand);
    };
    const sendToQueue = async (message, queueUrl) => {
      const sendMessageCommand = new SendMessageCommand({
        MessageBody: message,
        QueueUrl: queueUrl
      });
      await sqsClient.send(sendMessageCommand);
    };
    const parseStream = stream =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream
          .pipe(csvParser())
          .on('data', chunk => sendToQueue(JSON.stringify(chunk), importServiceConfig.SQS_URL))
          .on('error', reject)
          .on('end', () => resolve(chunks));
      });

    for (const record of event.Records) {
      const bucketName = record.s3.bucket.name;
      const objectKey = record.s3.object.key;
      console.log('In importProductsFile record.s3: ', record.s3);
      console.log('In importProductsFile record.s3.object: ', record.s3.object);

      const { Body } = await readFile(bucketName, objectKey);

      const parsedFileData = await parseStream(Body);

      console.log('In importProductsFile >>> parsedFileData: ', parsedFileData);

      const copyCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${objectKey}`,
        Key: objectKey.replace(s3ClientParams.UPLOAD_BASE_PATH, s3ClientParams.PARSE_BASE_PATH)
      });

      const s3CopyResponse = await s3Client.send(copyCommand);

      console.log('In importProductsFile >>> s3CopyResponse: ', s3CopyResponse);
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey
      });
      const s3DeleteResponse = await s3Client.send(deleteCommand);
      console.log('In importProductsFile >>> s3DeleteResponse: ', s3DeleteResponse);

      console.log('In importProductsFile >>> parsing of ' + record.s3.object.key.split('/')[1] + ' file is completed!');
    }
  } catch (error) {
    console.error('Error appears: ', error);
  }
};

export const main = importFileParser;

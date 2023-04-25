import { productService } from '@services/index';
import { SQSHandler } from 'aws-lambda';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { validateRequest } from '../../helpers/validate-request.helper';
import { ProductSchema } from '@functions/createProduct/schema';
import { ProductServiceConfig } from '../../configs/product-service.config';

export const catalogBatchProcess: SQSHandler = async event => {
  const batchItemFailures = [];
  const snsClient = new SNSClient({ region: process.env.REGION });

  console.log('In catalogBatchProcess >>> request: event ', event);

  const eventProcessingPromises = event.Records.map(async record => {
    try {
      const productBody = JSON.parse(record.body);
      await validateRequest({ event: record, schema: ProductSchema });

      console.log('In catalogBatchProcess >>> record: ', record);

      const product = await productService.createProduct(productBody);

      console.log('In catalogBatchProcess >>> new product is created: ', product);

      const publishCommand = new PublishCommand({
        TopicArn: ProductServiceConfig.SNS_ARN,
        Subject: 'New item is added to Product table!',
        Message: `New item is added to Product table. Item: ${JSON.stringify(product)}`,
      });
      await snsClient.send(publishCommand);
    } catch (error) {
      console.error('In catalogBatchProcess >> error: ', error);
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  });
  await Promise.all(eventProcessingPromises);

  if (batchItemFailures.length) {
    const publishCommand = new PublishCommand({
      TopicArn: ProductServiceConfig.SNS_ARN,
      Subject: 'FAILURE: In catalogBatchProcess!',
      Message: `A failure occurred while handling the 'catalogBatchProcess' event at the following elements: ${JSON.stringify(batchItemFailures)}`,
      MessageAttributes: {
        error: {
          DataType: 'String',
          StringValue: 'batchItemFailures'
        }
      }
    });
    await snsClient.send(publishCommand);
  }

  return { batchItemFailures };
};

export const main = catalogBatchProcess;

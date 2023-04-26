import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import { catalogBatchProcess } from '@functions/catalogBatchProcess/handler';
import { ProductServiceConfig } from '../../../configs/product-service.config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import * as validateRequestHelper from '../../../helpers/validate-request.helper';
import { productService } from '@services/index';

describe('catalogBatchProcess handler', () => {
  const mockSNSClient = mockClient(SNSClient);
  const messageId_1 = 'aaae732c-9799-4522-a272-373bc922f351';
  const messageId_2 = '92013a34-546a-44fd-b50c-967c17f5741f';
  const productMock = {
    id: 'd98173c2-aa8b-4c49-bf42-60619a555a65',
    title: 'Product-3 from csv',
    description: 'Product description 3',
    price: '834',
    count: '7'
  };
  let validateRequestSpy;
  let createProductSpy;

  const mockEvent: any = {
    Records: [
      {
        messageId: messageId_1,
        body: JSON.stringify(productMock)
      },
      {
        messageId: messageId_2,
        body: JSON.stringify(productMock)
      }
    ]
  };

  const batchItemFailuresMock = [{ itemIdentifier: messageId_1 }, { itemIdentifier: messageId_2 }];

  const publishCommandMock = {
    TopicArn: ProductServiceConfig.SNS_ARN,
    Subject: 'New item is added to Product table!',
    Message: `New item is added to Product table. Item: ${JSON.stringify(productMock)}`
  };

  const publishFailureCommandMock = {
    TopicArn: ProductServiceConfig.SNS_ARN,
    Subject: 'FAILURE: In catalogBatchProcess!',
    Message: `A failure occurred while handling the 'catalogBatchProcess' event at the following elements: ${JSON.stringify(batchItemFailuresMock)}`,
    MessageAttributes: {
      error: {
        DataType: 'String',
        StringValue: 'batchItemFailures'
      }
    }
  };

  beforeEach(() => {
    mockSNSClient.on(PublishCommand).resolves({});
    validateRequestSpy = jest.spyOn(validateRequestHelper, 'validateRequest');
    createProductSpy = jest.spyOn(productService, 'createProduct');
  });

  afterEach(() => {
    mockSNSClient.reset();
    jest.resetAllMocks();
  });

  it('should validate records and publish message of created item', async () => {
    validateRequestSpy.mockImplementation(() => productMock);
    createProductSpy.mockImplementation(() => Promise.resolve(productMock));
    const SQSBatchResponse: any = await catalogBatchProcess(mockEvent, null, null);

    expect(mockSNSClient).toHaveReceivedCommandWith(PublishCommand, publishCommandMock);
    expect(productService.createProduct).toHaveBeenCalledWith(productMock);
    expect(SQSBatchResponse.batchItemFailures).toEqual([]);
  });

  it('should throw an error on records validation and publish a Failure message', async () => {
    validateRequestSpy.mockImplementation(() => Promise.reject());
    const SQSBatchResponse: any = await catalogBatchProcess(mockEvent, null, null);

    expect(mockSNSClient).toHaveReceivedCommandWith(PublishCommand, publishFailureCommandMock);
    expect(SQSBatchResponse.batchItemFailures).toEqual(batchItemFailuresMock);
  });
});

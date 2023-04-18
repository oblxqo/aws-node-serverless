import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.REGION || 'us-east-1';

const dynamoDBClient = new DynamoDBClient({
  region: REGION,
})

const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient)

export { dynamoDBDocClient, dynamoDBClient };
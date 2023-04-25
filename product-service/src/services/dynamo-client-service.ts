import {
  CreateTableCommand,
  CreateTableCommandInput,
  DeleteTableCommand,
  DeleteTableCommandOutput,
  DescribeTableCommand,
  DynamoDBClient,
  TransactWriteItemsCommand,
  TransactWriteItemsCommandInput,
  waitUntilTableExists,
  waitUntilTableNotExists
} from '@aws-sdk/client-dynamodb';
import { PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Product } from '@models/product.model';
import { v4 as uuidv4 } from 'uuid';
import { WaiterResult } from '@aws-sdk/util-waiter';
import { ProductServiceConfig } from '../configs/product-service.config';

export class DynamoClientService {
  public ddbClient: DynamoDBClient;

  constructor(ddbClient: DynamoDBClient) {
    this.ddbClient = ddbClient;
  }

  public async createTable(tableInput: CreateTableCommandInput): Promise<DeleteTableCommandOutput> {
    if (!(await this.isTableExist(tableInput.TableName))) {
      try {
        return await this.ddbClient.send(new CreateTableCommand(tableInput));
      } catch (err) {
        throw new Error(err);
      }
    }
  }

  public async deleteTable(tableName: string): Promise<DeleteTableCommandOutput> {
    try {
      if (await this.isTableExist(tableName)) {
        return await this.ddbClient.send(
          new DeleteTableCommand({
            TableName: tableName
          })
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  public async waitUntilTableExists(tableName: string): Promise<WaiterResult> {
    return await waitUntilTableExists(
      {
        client: this.ddbClient,
        maxWaitTime: 30
      },
      {
        TableName: tableName
      }
    );
  }

  public async waitUntilTableNotExists(tableName: string): Promise<WaiterResult> {
    return await waitUntilTableNotExists(
      {
        client: this.ddbClient,
        maxWaitTime: 25
      },
      {
        TableName: tableName
      }
    );
  }

  public async isTableExist(tableName: string): Promise<boolean> {
    try {
      await this.ddbClient.send(
        new DescribeTableCommand({
          TableName: tableName
        })
      );
      return true;
    } catch {
      return false;
    }
  }

  public async transactWriteItemsPut({ id = uuidv4(), title, description, price, count }: Product): Promise<Product> {
    const stockId = uuidv4();
    const transaction: TransactWriteItemsCommandInput = {
      TransactItems: [
        {
          Put: {
            TableName: ProductServiceConfig.PRODUCTS_TABLE,
            Item: {
              id: { S: id },
              title: { S: title },
              description: { S: description },
              price: {
                N: `${price}`
              }
            },
            ConditionExpression: 'attribute_not_exists(id)'
          }
        },
        {
          Put: {
            TableName: ProductServiceConfig.STOCKS_TABLE,
            Item: {
              id: { S: stockId },
              product_id: { S: id },
              count: { N: `${count}` }
            },
            ConditionExpression: 'attribute_not_exists(product_id)'
          }
        }
      ]
    };
    try {
      await this.ddbClient.send(new TransactWriteItemsCommand(transaction));
      return { id, title, description, price, count };
    } catch (err) {
      console.log('In transactWriteItemsPut >>> error: ', err);
      throw new Error(err);
    }
  }

  public async getAllTableItems(tableName: string) {
    try {
      const result = await this.ddbClient.send(
        new ScanCommand({
          TableName: tableName
        })
      );
      return result.Items;
    } catch (err) {
      console.log('In getAllTableItems >>> error: ', err);
      throw new Error(err);
    }
  }

  public async getItemById(tableName: string, keyValue: string, key: string = 'id') {
    try {
      const result = await this.ddbClient.send(
        new QueryCommand({
          TableName: tableName,
          ExpressionAttributeValues: {
            ':keyValue': keyValue
          },
          KeyConditionExpression: `${key} = :keyValue`
        })
      );
      return result?.Items[0];
    } catch (err) {
      console.log('In getItemById >>> error: ', err);
      throw new Error(err);
    }
  }

  public async putItem(tableName: string, item) {
    try {
      await this.ddbClient.send(
        new PutCommand({
          TableName: tableName,
          Item: item
        })
      );
    } catch (err) {
      throw new Error(err);
    }
  }
}
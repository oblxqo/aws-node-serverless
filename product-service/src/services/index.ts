import { ProductService } from './product-service';
import { DynamoClientService } from "@services/dynamo-client-service";
import { dynamoDBClient } from "../db/dynamoDB/dyamoDBClient";

const dynamoClientService = new DynamoClientService(dynamoDBClient);
const productService = new ProductService(dynamoClientService);

export { productService, dynamoClientService };

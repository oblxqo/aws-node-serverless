import { ProductService } from './product-service';
import { DynamoClientService } from "@services/dynamo-client-service";
import { dynamoDBClient } from "../db/dynamoDB/dyamoDBClient";
// import { pgPool } from "../db/pg/pgClient";
// import { RdsClientService } from "@services/rds-client-service";

const dynamoClientService = new DynamoClientService(dynamoDBClient);

// Dynamo
const productService = new ProductService(dynamoClientService);
// PG
// const pgClientService = new RdsClientService(pgPool);
// const productService = new ProductService(pgClientService);

export {
  productService,
  dynamoClientService,
  // pgClientService
};

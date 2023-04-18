import { dynamoClientService } from "@services/index";
import { productTableParams, stockTableParams } from "../db/dynamoDB/table-params";
import { mockProducts } from "@mocks/products.mock";

(async () => {
  try {
    await dynamoClientService.deleteTable(productTableParams.TableName);
    await dynamoClientService.deleteTable(stockTableParams.TableName);

    await dynamoClientService.waitUntilTableNotExists(productTableParams.TableName);
    await dynamoClientService.waitUntilTableNotExists(stockTableParams.TableName);

    await dynamoClientService.createTable(productTableParams);
    await dynamoClientService.createTable(stockTableParams);

    await dynamoClientService.waitUntilTableExists(productTableParams.TableName);
    await dynamoClientService.waitUntilTableExists(stockTableParams.TableName);

    for (const product of mockProducts) {
      await dynamoClientService.transactWriteItemsPut(product);
    }
  } catch (error) {
    console.error('In dynamoDB-init >>> error: ', error);
  }
})();
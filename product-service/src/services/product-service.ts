import { Product } from '@models/product.model';
import { DynamoClientService } from "@services/dynamo-client-service";
import { TablesConfig } from "../configs/tables.config";
import { mapKeyValueToObject } from "../helpers/convert-data.helper";

export class ProductService {
  public client;

  constructor(client: DynamoClientService) {
    this.client = client;
  }

  public async getProductsWithStocks(): Promise<Product[]> {
    try {
      const products = await this.client.getAllTableItems(TablesConfig.PRODUCTS_TABLE);
      const stocks = await this.client.getAllTableItems(TablesConfig.STOCKS_TABLE);

      const stocksObj = mapKeyValueToObject(stocks, 'product_id');

      const joinedTables = products.reduce((acc, product) => {
        acc.push({ ...product, count: stocksObj[product.id]?.count || 0 });
        return acc;
      }, [])
      console.log('In getProductsWithStocks joinedTables', joinedTables);
      return joinedTables;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getProductById(id: string): Promise<Product> {
    const product = await this.client.getItemById(TablesConfig.PRODUCTS_TABLE, id);
    const stock = await this.client.getItemById(TablesConfig.STOCKS_TABLE, id, 'product_id');

    return { ...product, count: stock.count };
  }

  public async createProduct(productData): Promise<Product> {
    try {
      return await this.client.transactWriteItemsPut(productData);
    } catch (err) {
      throw new Error(err);
    }
  }
}

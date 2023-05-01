import { Product } from '@models/product.model';
import { DynamoClientService } from '@services/dynamo-client-service';
import { mapKeyValueToObject } from '../helpers/convert-data.helper';
import { ProductServiceConfig } from '../configs/product-service.config';

// import { RdsClientService } from "@services/rds-client-service";

export class ProductService {
  public client: DynamoClientService;
  // public client: RdsClientService;

  // constructor(client: RdsClientService) {
  constructor(client: DynamoClientService) {
    this.client = client;
  }

  public async getProductsWithStocks(): Promise<any> {
    try {
      // Dynamo
      const products = await this.client.getAllTableItems(ProductServiceConfig.PRODUCTS_TABLE);
      const stocks = await this.client.getAllTableItems(ProductServiceConfig.STOCKS_TABLE);

      // PG
      // const joinedTables = await this.client.getAllTableItems();

      const stocksObj = mapKeyValueToObject(stocks, 'product_id');

      const joinedTables = products.reduce((acc, product) => {
        acc.push({ ...product, count: stocksObj[product.id]?.count || 0 });
        return acc;
      }, []);
      console.log('In getProductsWithStocks >>> joinedTables', joinedTables);
      return joinedTables;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getProductById(id: string): Promise<any> {
    try {
      // Dynamo
      const product = await this.client.getItemById(ProductServiceConfig.PRODUCTS_TABLE, id);
      const stock = await this.client.getItemById(ProductServiceConfig.STOCKS_TABLE, id, 'product_id');

      // PG
      // const product = await this.client.getItemById(id);
      console.log('In getProductById >>> product: ', product);

      if (!product || !stock) return;

      // return product;
      return { ...product, count: stock.count };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async createProduct(productData): Promise<Product> {
    try {
      return await this.client.transactWriteItemsPut(productData);
    } catch (err) {
      throw new Error(err);
    }
  }
}

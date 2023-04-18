import { Product } from "@models/product.model";
// import { v4 as uuidv4 } from "uuid";
import { Pool, QueryConfig } from "pg";
import {
  CREATE_PRODUCT_ENTITY,
  CREATE_STOCK_ENTITY,
  GET_PRODUCT_BY_ID,
  GET_PRODUCTS_LIST
} from "../db/pg/queries/product-queries";

export class RdsClientService {
  public pgClient: Pool;

  constructor(pgClient: Pool) {
    this.pgClient = pgClient;
  }

  public async runQueries(cb: () => Promise<any>): Promise<any> {
    const poolClient = await this.pgClient.connect();
    let result;

    try {
      await poolClient.query('BEGIN');
      try {
        result = await cb();
        await poolClient.query('COMMIT');
      } catch (err) {
        await poolClient.query('ROLLBACK');
        throw err;
      }
    } finally {
      await poolClient.release();
    }
    return result;
  }

  public async transactWriteItemsPut({ title, description, price, count }: Product): Promise<Product> {
    const productQuery: QueryConfig = { text: CREATE_PRODUCT_ENTITY, values: [title, description, price] };
    const stockQuery = (productId): QueryConfig => ({ text: CREATE_STOCK_ENTITY, values: [productId, count] });

    try {
      const [productQueryResult, stockQueryResult] = await this.runQueries(async () => {
        const createdProduct = await this.pgClient.query(productQuery);
        const createdStock = await this.pgClient.query(stockQuery(createdProduct.rows?.[0].id));
        return [createdProduct, createdStock]
      });
      return { ...productQueryResult.rows?.[0], count: stockQueryResult.rows?.[0].count };
    } catch (err) {
      console.log("In createItem >>> error: ", err);
      throw new Error(err);
    }
  }

  public async getAllTableItems() {
    try {
      const getProductListQuery: QueryConfig = { text: GET_PRODUCTS_LIST };
      const productsListQueryResult = await this.runQueries(async () => await this.pgClient.query(getProductListQuery));
      console.log("In getAllTableItems >>> productsListQueryResult: ", productsListQueryResult);
      return productsListQueryResult.rows;
    } catch (err) {
      console.log("In getAllTableItems >>> error: ", err);
      throw new Error(err);
    }
  }

  public async getItemById(id: string) {
    try {
      const getProductQuery: QueryConfig = { text: GET_PRODUCT_BY_ID, values: [id] };
      const productQueryResult = await this.runQueries(async () => await this.pgClient.query(getProductQuery));
      console.log("In getItemById >>> productQueryResult: ", productQueryResult);
      return productQueryResult.rows?.[0];
    } catch (err) {
      console.log("In getItemById >>> error: ", err);
      throw new Error(err);
    }
  }
}
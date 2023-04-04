import { mockProducts } from '@mocks/products.mock';
import { Product } from '@models/product.model';

export class ProductService {
  public getAllProducts(): Promise<Product[]> {
    return Promise.resolve(mockProducts);
  }

  public getProductById(id): Promise<Product> {
    return Promise.resolve(mockProducts.find(product => product.id === id));
  }
}

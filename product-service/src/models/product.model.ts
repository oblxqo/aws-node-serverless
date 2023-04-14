export interface Product extends Omit<Stock, 'product_id'> {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface Stock {
  product_id: string;
  count: number;
}

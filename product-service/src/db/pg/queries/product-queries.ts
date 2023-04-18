export const GET_PRODUCTS_LIST = `
  SELECT p.id, p.title, p.description, p.price, s.count
  FROM products AS p
  JOIN stocks AS s ON p.id = s.product_id
`

export const GET_PRODUCT_BY_ID = `
  ${GET_PRODUCTS_LIST} WHERE p.id = $1;
`

export const CREATE_PRODUCT_ENTITY = `
  INSERT INTO products(title, description, price)
  VALUES($1, $2, $3)
  RETURNING *
`

export const CREATE_STOCK_ENTITY = `
  INSERT INTO stocks(product_id, count)
  VALUES($1, $2)
  RETURNING *
`
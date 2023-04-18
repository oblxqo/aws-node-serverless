export const productTableParams = {
  "TableName": "products",
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    },
    {
      "AttributeName": "title",
      "AttributeType": "S"
    }
  ],
  "KeySchema": [
    {
      "KeyType": "HASH",
      "AttributeName": "id"
    },
    {
      "KeyType": "RANGE",
      "AttributeName": "title"
    }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 1,
    "WriteCapacityUnits": 1,
  }
};

export const stockTableParams = {
  "TableName": "stocks",
  "AttributeDefinitions": [
    {
      "AttributeName": "product_id",
      "AttributeType": "S"
    },
    {
      "AttributeName": "count",
      "AttributeType": "N"
    }
  ],
  "KeySchema": [
    {
      "KeyType": "HASH",
      "AttributeName": "product_id"
    },
    {
      "KeyType": "RANGE",
      "AttributeName": "count"
    }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 1,
    "WriteCapacityUnits": 1,
  }
};
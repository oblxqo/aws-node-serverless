export const ProductServiceConfig = {
  PRODUCTS_TABLE: process.env.PRODUCTS_TABLE || 'products',
  STOCKS_TABLE: process.env.STOCKS_TABLE || 'stocks',
  SUBSCRIPTION_EMAIL_DEV: process.env.SUBSCRIPTION_EMAIL_DEV || '',
  SUBSCRIPTION_EMAIL_DEBUG: process.env.SUBSCRIPTION_EMAIL_DEBUG || '',
  SNS_ARN: process.env.SNS_ARN,
}
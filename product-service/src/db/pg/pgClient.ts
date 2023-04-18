import { Pool } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const clientConfig = {
  host: PG_HOST,
  port: Number(PG_PORT),
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
};

const pgPool = new Pool(clientConfig);

// pgPool.connect(err => {
//   if (err) {
//     console.error('PG error connecting: ', err.stack);
//   } else {
//     console.log('PG is successfully connected.');
//   }
// });

// await pgPool.connect();

export { pgPool };
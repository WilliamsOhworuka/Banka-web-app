import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default {
  query(text, values) {
    return new Promise((resolve, reject) => {
      pool.query(text, values)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
};

import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    host: process.env.DATABASE_HOST || '192.168.0.250',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'testToDo',
    password: process.env.DATABASE_PASSWORD || 'testToDo',
    database: process.env.DATABASE_NAME || 'ToDo'
  }
} satisfies Config; 
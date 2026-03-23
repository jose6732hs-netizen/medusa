import { db } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

export const client = db({
  connectionString: process.env.DATABASE_URL,
});

export const dbClient = drizzle(client, { schema });

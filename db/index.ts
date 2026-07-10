import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.includes('placeholder')) {
  console.warn('[db] DATABASE_URL is not configured. Database features will be unavailable.');
}

// Strip unsupported channel_binding parameter that breaks Neon's HTTP driver
const safeUrl = (databaseUrl || 'postgresql://placeholder-url')
  .replace(/[&?]channel_binding=[^&]*/g, '');

const sql = neon(safeUrl);
export const db = drizzle({ client: sql, schema });
export * from '@/db/schema';

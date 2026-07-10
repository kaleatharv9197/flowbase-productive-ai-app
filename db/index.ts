import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

/**
 * Safe Neon + Drizzle initializer.
 *
 * Wrapped in a try-catch so that an invalid / unconfigured DATABASE_URL
 * never crashes the SSR bundle at module-evaluation time.
 * Actual query errors will surface clearly when a query is attempted.
 */
function initDb() {
  const raw = process.env.DATABASE_URL ?? '';

  // Strip the `channel_binding` param – not supported by Neon's HTTP driver.
  const url = raw
    .replace(/([&?])channel_binding=[^&]*/g, '$1')
    .replace(/[?&]+$/, '');

  try {
    const sql = neon(url);
    return drizzle({ client: sql, schema });
  } catch (err) {
    // Log once at startup so the developer knows what's wrong.
    console.error(
      '[db] Neon client failed to initialize. Check DATABASE_URL in .env\n',
      err
    );

    // Return a stub whose every method throws a descriptive error, so the
    // app doesn't silently misbehave – it fails loudly on the first DB call.
    const stub = new Proxy({} as ReturnType<typeof drizzle>, {
      get(_t, prop: string) {
        return () => {
          throw new Error(
            `[db] Database is not configured. Attempted to call db.${prop}(). ` +
            'Please set a valid DATABASE_URL in your .env file.'
          );
        };
      },
    });
    return stub;
  }
}

export const db = initDb();
export * from '@/db/schema';

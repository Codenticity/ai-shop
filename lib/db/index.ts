// lib/db/index.ts
// Single shared Postgres pool + Drizzle instance. Imported by server
// components, server actions, and API routes — never by client components.

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

// Reuse the pool across hot-reloads in dev so we don't exhaust connections.
const pool =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
     ssl: {
      rejectUnauthorized: false,
  },
});

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool;
}

export const db = drizzle(pool, { schema });

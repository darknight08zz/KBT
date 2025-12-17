import { Pool } from 'pg';

// Global type for development to prevent multiple pools in hot reload
declare global {
  var postgresPool: Pool | undefined;
}

const pool = global.postgresPool || new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://postgres:ujjwal0802@localhost:5432/kbt',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

if (process.env.NODE_ENV !== 'production') {
  global.postgresPool = pool;
}

export default pool;

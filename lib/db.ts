import { Pool } from 'pg';

// Global type for development to prevent multiple pools in hot reload
declare global {
  var postgresPool: Pool | undefined;
}

const pool = global.postgresPool || new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Rhgv8yuVqlX1@ep-twilight-silence-a400lc5v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

if (process.env.NODE_ENV !== 'production') {
  global.postgresPool = pool;
}

export default pool;

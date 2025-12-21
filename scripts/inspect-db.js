const { Client } = require('pg');

// Use the same connection string logic as lib/db.ts
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Rhgv8yuVqlX1@ep-twilight-silence-a400lc5v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
});

async function inspectSchema() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'leaderboard'
        `);
        console.log('Columns:', res.rows);

        const constraints = await client.query(`
            SELECT conname, contype, pg_get_constraintdef(oid) 
            FROM pg_constraint 
            WHERE conrelid = 'leaderboard'::regclass
        `);
        console.log('Constraints:', constraints.rows);

    } catch (err) {
        console.error('Inspection Error:', err);
    } finally {
        await client.end();
    }
}

inspectSchema();

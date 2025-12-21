const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Rhgv8yuVqlX1@ep-twilight-silence-a400lc5v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
});

async function migrate() {
    try {
        await client.connect();
        console.log('Adding year column to leaderboard...');

        await client.query(`
            ALTER TABLE leaderboard 
            ADD COLUMN IF NOT EXISTS year VARCHAR(10) DEFAULT '1st';
        `);

        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration Error:', err);
    } finally {
        await client.end();
    }
}

migrate();

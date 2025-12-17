const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:ujjwal0802@localhost:5432/kbt',
});

async function updateDb() {
    const client = await pool.connect();
    try {
        // Add email column if not exists
        await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email VARCHAR(255);
    `);
        console.log("Column 'email' added to 'users' table.");
    } catch (err) {
        console.error('Error updating DB:', err);
    } finally {
        client.release();
        pool.end();
    }
}

updateDb();

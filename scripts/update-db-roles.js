const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:ujjwal0802@localhost:5432/kbt';

const pool = new Pool({
    connectionString,
});

async function updateDBWithRoles() {
    try {
        const client = await pool.connect();
        try {
            // Add role column if not exists
            await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'player';
      `);
            console.log("Column 'role' added to 'users' table.");
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error updating schema:", err);
    } finally {
        await pool.end();
    }
}

updateDBWithRoles();

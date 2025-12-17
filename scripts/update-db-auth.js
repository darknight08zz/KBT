const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:ujjwal0802@localhost:5432/kbt';

const pool = new Pool({
    connectionString,
});

async function updateDB() {
    try {
        const client = await pool.connect();
        try {
            await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
            console.log("Table 'users' is ready.");
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error updating schema:", err);
    } finally {
        await pool.end();
    }
}

updateDB();

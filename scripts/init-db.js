const { Pool, Client } = require('pg');

const dbConfig = {
    user: 'postgres',
    password: 'ujjwal0802',
    host: 'localhost',
    port: 5432,
};

async function initDB() {
    // Step 1: Create Database 'kbt' if not exists
    const sysClient = new Client({ ...dbConfig, database: 'postgres' });
    try {
        await sysClient.connect();
        const res = await sysClient.query("SELECT 1 FROM pg_database WHERE datname = 'kbt'");
        if (res.rowCount === 0) {
            console.log("Database 'kbt' does not exist. Creating...");
            await sysClient.query('CREATE DATABASE kbt');
            console.log("Database 'kbt' created.");
        } else {
            console.log("Database 'kbt' already exists.");
        }
    } catch (err) {
        console.error("Error creating database:", err);
        return; // Stop if we can't ensure DB exists (might be permission issue)
    } finally {
        await sysClient.end();
    }

    // Step 2: Create Table in 'kbt'
    const pool = new Pool({ ...dbConfig, database: 'kbt' });
    try {
        const client = await pool.connect();
        try {
            await client.query(`
        CREATE TABLE IF NOT EXISTS leaderboard (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL,
          time_taken INTEGER NOT NULL,
          score INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
            console.log("Table 'leaderboard' is ready.");
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error initializing schema:", err);
    } finally {
        await pool.end();
    }
}

initDB();

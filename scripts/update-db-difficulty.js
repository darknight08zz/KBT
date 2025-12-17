const { Pool } = require('pg');

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://postgres:ujjwal0802@localhost:5432/kbt';

const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function updateDbDifficulty() {
    const client = await pool.connect();
    try {
        // Add difficulty column if it doesn't exist
        await client.query(`
            ALTER TABLE questions 
            ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'medium';
        `);
        console.log("Added 'difficulty' column to 'questions' table.");

        // Update existing questions to have a default difficulty if needed (already handled by DEFAULT, but good to be explicit)
        await client.query("UPDATE questions SET difficulty = 'medium' WHERE difficulty IS NULL");
        console.log("Updated existing questions to default difficulty 'medium'.");

    } catch (err) {
        console.error('Error updating DB:', err);
    } finally {
        client.release();
        pool.end();
    }
}

updateDbDifficulty();

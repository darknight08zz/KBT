const { Pool } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_Rhgv8yuVqlX1@ep-twilight-silence-a400lc5v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});

async function migrate() {
    console.log('Connecting to Neon DB...');
    const client = await pool.connect();
    try {
        console.log('Running migration...');

        // 1. Questions Table Update
        await client.query(`
      ALTER TABLE questions ADD COLUMN IF NOT EXISTS year_category VARCHAR(20) DEFAULT '1st';
    `);
        console.log('✔ Added year_category to questions');

        // 2. Event Settings Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS event_settings (
          id SERIAL PRIMARY KEY,
          is_active BOOLEAN DEFAULT FALSE,
          end_time TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✔ Created event_settings table');

        // 3. Initialize Event Settings
        await client.query(`
      INSERT INTO event_settings (id, is_active)
      SELECT 1, FALSE
      WHERE NOT EXISTS (SELECT 1 FROM event_settings WHERE id = 1);
    `);
        console.log('✔ Initialized event_settings');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();

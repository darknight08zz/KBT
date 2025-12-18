import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();

        try {
            // 1. Create Users Table
            await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'player',
          email VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

            // 2. Create Leaderboard Table (if you have one, or plan to)
            await client.query(`
        CREATE TABLE IF NOT EXISTS leaderboard (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL REFERENCES users(username),
            score INTEGER NOT NULL,
            time_taken INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

            // 3. Apply Migrations (Safe to run multiple times)
            await client.query(`
                ALTER TABLE users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
                ALTER TABLE questions ADD COLUMN IF NOT EXISTS keywords TEXT;
                ALTER TABLE questions ADD COLUMN IF NOT EXISTS image_url TEXT;
                ALTER TABLE questions ADD COLUMN IF NOT EXISTS year_category VARCHAR(20) DEFAULT '1st';

                CREATE TABLE IF NOT EXISTS event_settings (
                    id SERIAL PRIMARY KEY,
                    is_active BOOLEAN DEFAULT FALSE,
                    end_time TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                -- Initialize event settings if empty
                INSERT INTO event_settings (id, is_active)
                SELECT 1, FALSE
                WHERE NOT EXISTS (SELECT 1 FROM event_settings WHERE id = 1);
            `);

            return NextResponse.json({
                message: 'Database initialized successfully',
                tables: ['users', 'leaderboard']
            });

        } finally {
            client.release();
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

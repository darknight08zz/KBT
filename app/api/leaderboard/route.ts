import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

interface LeaderboardEntry {
    username: string;
    time_taken: number;
    score: number;
    year?: string;
}

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query(
                'SELECT username, time_taken, score, created_at FROM leaderboard ORDER BY score DESC, time_taken ASC LIMIT 50'
            );
            return NextResponse.json(result.rows);
        } finally {
            client.release();
        }
    } catch (err) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: LeaderboardEntry = await request.json();
        const { username, time_taken, score, year } = body;
        const yearVal = year || '1st';

        if (!username || time_taken === undefined || score === undefined) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            // Check if user exists (Global check, ignoring year)
            const checkRes = await client.query('SELECT * FROM leaderboard WHERE username = $1', [username]);

            if (checkRes.rows.length > 0) {
                // User already exists.
                // Rule: "First time score is final". Do not update.
                return NextResponse.json({ success: true, message: 'Score already recorded' });
            } else {
                // Insert new entry
                await client.query(
                    'INSERT INTO leaderboard (username, time_taken, score, year) VALUES ($1, $2, $3, $4)',
                    [username, time_taken, score, yearVal]
                );
                return NextResponse.json({ success: true });
            }
        } finally {
            client.release();
        }
    } catch (err: any) {
        console.error('Leaderboard Submission Error:', err);
        // Handle race condition unique violation
        if (err.code === '23505') {
            return NextResponse.json({ success: true, message: 'Score already recorded' });
        }
        return NextResponse.json({ error: err.message || 'Database error' }, { status: 500 });
    }
}

import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

interface LeaderboardEntry {
    username: string;
    time_taken: number;
    score: number;
}

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            const result = await client.query(
                'SELECT username, time_taken, score, created_at FROM leaderboard ORDER BY time_taken ASC, score DESC LIMIT 50'
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
        const { username, time_taken, score } = body;

        if (!username || time_taken === undefined || score === undefined) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            await client.query(
                'INSERT INTO leaderboard (username, time_taken, score) VALUES ($1, $2, $3)',
                [username, time_taken, score]
            );
            return NextResponse.json({ success: true });
        } finally {
            client.release();
        }
    } catch (err) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

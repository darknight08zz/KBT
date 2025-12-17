import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    try {
        const client = await pool.connect();
        try {
            const result = await client.query(
                'SELECT score, time_taken FROM leaderboard WHERE username = $1',
                [username]
            );

            if (result.rows.length > 0) {
                return NextResponse.json({
                    hasAttempted: true,
                    score: result.rows[0].score,
                    time_taken: result.rows[0].time_taken
                });
            } else {
                return NextResponse.json({
                    hasAttempted: false
                });
            }
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Database error checking user status:", err);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

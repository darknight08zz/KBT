import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST() {
    try {
        const client = await pool.connect();
        // Truncate leaderboard table (removes all rows)
        await client.query('TRUNCATE TABLE leaderboard RESTART IDENTITY');
        client.release();
        return NextResponse.json({ success: true, message: 'Leaderboard reset successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

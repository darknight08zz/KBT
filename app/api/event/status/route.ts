import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT is_active, end_time FROM event_settings WHERE id = 1');
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ is_active: false, end_time: null });
        }
        return NextResponse.json(result.rows[0]);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

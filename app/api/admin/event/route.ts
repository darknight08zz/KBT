import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM event_settings WHERE id = 1');
        client.release();

        if (result.rows.length === 0) {
            return NextResponse.json({ is_active: false });
        }
        return NextResponse.json(result.rows[0]);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { action } = await request.json(); // 'start' or 'stop'
        const client = await pool.connect();

        if (action === 'start') {
            // Set end_time to 6 hours from now
            await client.query(`
                UPDATE event_settings 
                SET is_active = TRUE, 
                    end_time = NOW() + INTERVAL '6 hours' 
                WHERE id = 1
            `);
        } else if (action === 'stop') {
            await client.query('UPDATE event_settings SET is_active = FALSE WHERE id = 1');
        }

        const result = await client.query('SELECT * FROM event_settings WHERE id = 1');
        client.release();
        return NextResponse.json(result.rows[0]);

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

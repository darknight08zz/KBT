import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json({ error: 'Username required' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            await client.query('DELETE FROM users WHERE username = $1', [username]);
            return NextResponse.json({ success: true, message: 'Account deleted successfully' });
        } finally {
            client.release();
        }
    } catch (err: any) {
        console.error("Delete Account Error:", err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

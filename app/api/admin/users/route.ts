import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
        client.release();
        return NextResponse.json(result.rows);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const client = await pool.connect();
        await client.query('DELETE FROM users WHERE id = $1', [id]);
        client.release();
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, is_blocked } = body;
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const client = await pool.connect();
        await client.query('UPDATE users SET is_blocked = $1 WHERE id = $2', [is_blocked, id]);
        client.release();
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

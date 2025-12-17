import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM questions ORDER BY id ASC');
        client.release();
        return NextResponse.json(result.rows);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, options, answer, topic, difficulty, type } = body;

        const client = await pool.connect();
        await client.query(
            'INSERT INTO questions (text, options, answer, topic, difficulty, type) VALUES ($1, $2, $3, $4, $5, $6)',
            [text, options, answer, topic, difficulty || 'medium', type || 'mcq']
        );
        client.release();

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Delete requires ID from query params
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const client = await pool.connect();
        await client.query('DELETE FROM questions WHERE id = $1', [id]);
        client.release();

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

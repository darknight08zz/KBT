import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');

        const client = await pool.connect();

        let query = 'SELECT * FROM questions';
        let params: any[] = [];

        if (year) {
            query += ' WHERE year_category = $1';
            params.push(year);
        }

        query += ' ORDER BY id ASC';

        const result = await client.query(query, params);
        client.release();
        return NextResponse.json(result.rows);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, options, answer, topic, difficulty, type, keywords, image_url, year_category } = body;

        const client = await pool.connect();
        const keywordsStr = Array.isArray(keywords) ? keywords.join(',') : (keywords || '');
        await client.query(
            'INSERT INTO questions (text, options, answer, topic, difficulty, type, keywords, image_url, year_category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [text, options, answer, topic, difficulty || 'medium', type || 'mcq', keywordsStr, image_url, year_category || '1st']
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

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            const cols = await client.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'leaderboard'`);
            const cons = await client.query(`SELECT conname, contype, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'leaderboard'::regclass`);

            return NextResponse.json({
                columns: cols.rows,
                constraints: cons.rows,
                env_url: process.env.POSTGRES_URL ? 'Set' : 'Unset', // Do not leak full URL
                db_url: process.env.DATABASE_URL ? 'Set' : 'Unset'
            });
        } finally {
            client.release();
        }
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

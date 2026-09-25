import { NextResponse, NextRequest } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('score, time_taken')
            .eq('username', username)
            .maybeSingle();

        if (error) {
            console.error("Database error checking user status:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (data) {
            return NextResponse.json({
                hasAttempted: true,
                score: data.score,
                time_taken: data.time_taken,
            });
        } else {
            return NextResponse.json({
                hasAttempted: false,
            });
        }
    } catch (err: any) {
        console.error("Database error checking user status:", err);
        return NextResponse.json({ error: 'Database error: ' + (err.message || String(err)) }, { status: 500 });
    }
}

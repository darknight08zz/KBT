import { NextResponse, NextRequest } from 'next/server';
import supabase from '@/lib/supabase';

interface LeaderboardEntry {
    username: string;
    time_taken: number;
    score: number;
    year?: string;
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('username, time_taken, score, created_at')
            .order('score', { ascending: false })
            .order('time_taken', { ascending: true })
            .limit(50);

        if (error) {
            console.error('Leaderboard GET error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data || []);
    } catch (err: any) {
        return NextResponse.json({ error: 'Database error: ' + (err.message || String(err)) }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: LeaderboardEntry = await request.json();
        const { username, time_taken, score, year } = body;
        const yearVal = year || '1st';

        if (!username || time_taken === undefined || score === undefined) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Check if user has already submitted (First time score is final)
        const { data: existing, error: checkError } = await supabase
            .from('leaderboard')
            .select('id')
            .eq('username', username)
            .maybeSingle();

        if (checkError) {
            console.error('Leaderboard check error:', checkError);
            return NextResponse.json({ error: checkError.message }, { status: 500 });
        }

        if (existing) {
            return NextResponse.json({ success: true, message: 'Score already recorded' });
        }

        const { error: insertError } = await supabase
            .from('leaderboard')
            .insert([
                {
                    username,
                    time_taken,
                    score,
                    year: yearVal,
                },
            ]);

        if (insertError) {
            // Check for unique violation code (23505)
            if (insertError.code === '23505') {
                return NextResponse.json({ success: true, message: 'Score already recorded' });
            }
            console.error('Leaderboard insert error:', insertError);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Leaderboard Submission Error:', err);
        return NextResponse.json({ error: err.message || 'Database error' }, { status: 500 });
    }
}

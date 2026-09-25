import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
    try {
        const { data: leaderboardSample, error: lbError } = await supabase
            .from('leaderboard')
            .select('*')
            .limit(1);

        const { data: userSample, error: userError } = await supabase
            .from('users')
            .select('id, username, role, created_at')
            .limit(1);

        return NextResponse.json({
            supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
            supabase_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
            supabase_service_role_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'Missing',
            leaderboard_status: lbError ? lbError.message : 'Accessible',
            users_status: userError ? userError.message : 'Accessible',
            sample_leaderboard: leaderboardSample,
            sample_user: userSample,
        });
    } catch (err: any) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

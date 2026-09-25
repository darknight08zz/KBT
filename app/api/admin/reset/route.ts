import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST() {
    try {
        // Delete all rows from leaderboard
        const { error } = await supabase
            .from('leaderboard')
            .delete()
            .neq('id', 0);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Leaderboard reset successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
    try {
        // Test connectivity by querying tables
        const { error: userError } = await supabase.from('users').select('id', { head: true, count: 'exact' });
        const { error: eventError } = await supabase.from('event_settings').select('id', { head: true, count: 'exact' });

        if (userError || eventError) {
            return NextResponse.json({
                status: 'pending_setup',
                message: 'Supabase connection established, but tables need to be created. Please run the provided supabase-schema.sql script in your Supabase SQL Editor.',
                errors: {
                    users: userError?.message,
                    event_settings: eventError?.message,
                },
            }, { status: 200 });
        }

        return NextResponse.json({
            status: 'ready',
            message: 'Supabase database is connected and tables are initialized!',
            tables: ['users', 'questions', 'leaderboard', 'event_settings'],
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

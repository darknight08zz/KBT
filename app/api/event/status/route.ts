import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('event_settings')
            .select('is_active')
            .eq('id', 1)
            .maybeSingle();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ is_active: false });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

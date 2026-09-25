import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('event_settings')
            .select('is_active')   // Only read is_active — ignore any stale end_time
            .eq('id', 1)
            .maybeSingle();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ is_active: false });
        }

        return NextResponse.json({ is_active: !!data.is_active });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { action } = await request.json(); // 'enable' | 'disable'

        let updateData: Record<string, any> = {};

        if (action === 'enable' || action === 'start') {
            updateData = {
                is_active: true,
                end_time: null,   // Always clear any residual timer
            };
        } else if (action === 'disable' || action === 'stop') {
            updateData = {
                is_active: false,
                end_time: null,   // Clear residual timer on disable too
            };
        } else {
            return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('event_settings')
            .upsert({ id: 1, ...updateData })
            .select('is_active')
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ is_active: !!data.is_active });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

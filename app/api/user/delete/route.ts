import { NextResponse, NextRequest } from 'next/server';
import supabase from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json({ error: 'Username required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('users')
            .delete()
            .eq('username', username);

        if (error) {
            console.error("Delete Account Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Account deleted successfully' });
    } catch (err: any) {
        console.error("Delete Account Error:", err);
        return NextResponse.json({ error: 'Internal server error: ' + (err.message || String(err)) }, { status: 500 });
    }
}

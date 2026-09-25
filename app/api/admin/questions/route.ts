import { NextResponse, NextRequest } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');

        let query = supabase.from('questions').select('*');

        if (year) {
            query = query.eq('year_category', year);
        }

        const { data, error } = await query.order('id', { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data || []);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, options, answer, topic, difficulty, type, keywords, image_url, year_category } = body;

        const keywordsStr = Array.isArray(keywords) ? keywords.join(',') : (keywords || '');
        let optionsData = options;
        if (typeof options === 'string') {
            try {
                optionsData = JSON.parse(options);
            } catch {
                optionsData = options.split(',').map((s: string) => s.trim());
            }
        }

        const { error } = await supabase.from('questions').insert([
            {
                text,
                options: optionsData,
                answer,
                topic,
                difficulty: difficulty || 'medium',
                type: type || 'mcq',
                keywords: keywordsStr,
                image_url,
                year_category: year_category || '1st',
            },
        ]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, text, options, answer, topic, difficulty, type, keywords, image_url, year_category } = body;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const keywordsStr = Array.isArray(keywords) ? keywords.join(',') : (keywords || '');
        let optionsData = options;
        if (typeof options === 'string') {
            try {
                optionsData = JSON.parse(options);
            } catch {
                optionsData = options.split(',').map((s: string) => s.trim());
            }
        }

        const { error } = await supabase
            .from('questions')
            .update({
                text,
                options: optionsData,
                answer,
                topic,
                difficulty: difficulty || 'medium',
                type: type || 'mcq',
                keywords: keywordsStr,
                image_url,
                year_category: year_category || '1st',
            })
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const { error } = await supabase
            .from('questions')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

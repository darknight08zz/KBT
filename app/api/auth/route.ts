import { NextResponse, NextRequest } from 'next/server';
import supabase from '@/lib/supabase';
import bcrypt from 'bcryptjs';

interface AuthRequestBody {
    action: 'register' | 'login';
    username: string;
    email?: string;
    university?: string;
    password?: string;
    role?: 'admin' | 'player';
    secretKey?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: AuthRequestBody = await request.json();
        const { action, username, email, university, password, role, secretKey } = body;

        console.log(`Auth Request: Action=${action}, User=${username}, Email=${email}, Uni=${university}, Role=${role}`);

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        if (action === 'register') {
            const userRole = (role === 'admin' || role === 'player') ? role : 'player';

            if (userRole === 'admin') {
                if (secretKey !== 'ieeexim2025') {
                    return NextResponse.json({ error: 'Invalid Admin Secret Key' }, { status: 403 });
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Check if user exists
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('id')
                .eq('username', username)
                .maybeSingle();

            if (checkError) {
                return NextResponse.json({ error: 'Database error: ' + checkError.message }, { status: 500 });
            }

            if (existingUser) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
            }

            // Insert new user
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        username,
                        password: hashedPassword,
                        role: userRole,
                        email: email || null,
                        university: university || null,
                    },
                ]);

            if (insertError) {
                return NextResponse.json({ error: 'Failed to create user: ' + insertError.message }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'User registered successfully!' });

        } else if (action === 'login') {
            // Find user
            const { data: user, error: findError } = await supabase
                .from('users')
                .select('id, password, role, is_blocked')
                .eq('username', username)
                .maybeSingle();

            if (findError) {
                return NextResponse.json({ error: 'Database error: ' + findError.message }, { status: 500 });
            }

            if (!user) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            if (user.is_blocked) {
                return NextResponse.json({ error: 'Your account has been blocked' }, { status: 403 });
            }

            // Compare password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            return NextResponse.json({ success: true, username, role: user.role });

        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (err: any) {
        console.error("Auth API Error Detailed:", err);
        return NextResponse.json({ error: 'Internal server error: ' + (err.message || String(err)) }, { status: 500 });
    }
}

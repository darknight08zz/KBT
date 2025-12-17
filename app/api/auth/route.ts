import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

interface AuthRequestBody {
    action: 'register' | 'login';
    username: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'player';
    secretKey?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: AuthRequestBody = await request.json();
        const { action, username, email, password, role, secretKey } = body;

        console.log(`Auth Request: Action=${action}, User=${username}, Email=${email}, Role=${role}`);

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const client = await pool.connect();

        try {
            if (action === 'register') {
                // Default role to 'player' if not provided or invalid
                const userRole = (role === 'admin' || role === 'player') ? role : 'player';

                // Admin Secret Key Validation
                if (userRole === 'admin') {
                    if (secretKey !== 'ieeexim2025') {
                        return NextResponse.json({ error: 'Invalid Admin Secret Key' }, { status: 403 });
                    }
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Check if user exists
                const userCheck = await client.query('SELECT id FROM users WHERE username = $1', [username]);
                if (userCheck.rows.length > 0) {
                    return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
                }

                // Insert new user
                await client.query(
                    'INSERT INTO users (username, password, role, email) VALUES ($1, $2, $3, $4)',
                    [username, hashedPassword, userRole, email || null]
                );

                return NextResponse.json({ success: true, message: 'User registered successfully!' });

            } else if (action === 'login') {
                // Find user
                const res = await client.query('SELECT id, password, role FROM users WHERE username = $1', [username]);

                if (res.rows.length === 0) {
                    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
                }

                const user = res.rows[0];

                // Compare password
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
                }

                // Login success
                return NextResponse.json({ success: true, username, role: user.role });

            } else {
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
            }

        } finally {
            client.release();
        }
    } catch (err: any) {
        console.error("Auth API Error Detailed:", err);
        return NextResponse.json({ error: 'Internal server error: ' + (err.message || String(err)) }, { status: 500 });
    }
}

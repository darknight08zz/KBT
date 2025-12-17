const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:ujjwal0802@localhost:5432/kbt',
});

async function checkUser() {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT username, email FROM users WHERE username = 'UniStudent'");
        if (res.rows.length > 0) {
            console.log('User Found:', res.rows[0]);
        } else {
            console.log('User Not Found');
        }
    } catch (err) {
        console.error('Error querying DB:', err);
    } finally {
        client.release();
        pool.end();
    }
}

checkUser();

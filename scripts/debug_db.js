const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres:ujjwal0802@localhost:5432/kbt',
});

async function check() {
    try {
        const res = await pool.query('SELECT * FROM leaderboard LIMIT 5');
        console.log('Leaderboard Data:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();

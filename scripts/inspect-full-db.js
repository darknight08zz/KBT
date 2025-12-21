const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Rhgv8yuVqlX1@ep-twilight-silence-a400lc5v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
});

async function inspectSchema() {
    try {
        await client.connect();

        let output = '--- LEADERBOARD TABLE ---\n';
        const cols = await client.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'leaderboard'`);
        output += JSON.stringify(cols.rows, null, 2) + '\n';

        const cons = await client.query(`SELECT conname, contype, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'leaderboard'::regclass`);
        output += JSON.stringify(cons.rows, null, 2) + '\n';

        output += '\n--- USERS TABLE ---\n';
        const ucols = await client.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users'`);
        output += JSON.stringify(ucols.rows, null, 2) + '\n';

        const ucons = await client.query(`SELECT conname, contype, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'users'::regclass`);
        output += JSON.stringify(ucons.rows, null, 2) + '\n';

        fs.writeFileSync('db-schema.txt', output);
        console.log('Schema written to db-schema.txt');

    } catch (err) {
        console.error('Inspection Error:', err);
    } finally {
        await client.end();
    }
}

inspectSchema();

const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || 'postgresql://postgres:ujjwal0802@localhost:5432/kbt';

if (!connectionString) {
    console.error('❌ Error: POSTGRES_URL or DATABASE_URL environment variable is not defined.');
    console.log('   Please create a .env file with your Neon database connection string.');
    process.exit(1);
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('🔌 Connected to database...');

        // 1. Create/Update Users Table
        console.log('👤 Checking Users table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'player',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Add email column if it doesn't exist
        try {
            await client.query(`ALTER TABLE users ADD COLUMN email VARCHAR(255);`);
            console.log('   ✅ Added "email" column to users table.');
        } catch (e) {
            if (e.code === '42701') {
                console.log('   ℹ️  "email" column already exists.');
            } else {
                throw e;
            }
        }

        // Add university column if it doesn't exist
        try {
            await client.query(`ALTER TABLE users ADD COLUMN university VARCHAR(255);`);
            console.log('   ✅ Added "university" column to users table.');
        } catch (e) {
            if (e.code === '42701') {
                console.log('   ℹ️  "university" column already exists.');
            } else {
                throw e;
            }
        }

        // 2. Create Leaderboard Table
        console.log('🏆 Checking Leaderboard table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        time_taken INTEGER NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 3. Create Questions Table
        console.log('❓ Checking Questions table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        options TEXT[] NOT NULL,
        answer TEXT NOT NULL,
        topic VARCHAR(100),
        type VARCHAR(50) DEFAULT 'mcq'
      );
    `);

        // Add type column if it doesn't exist
        try {
            await client.query(`ALTER TABLE questions ADD COLUMN type VARCHAR(50) DEFAULT 'mcq';`);
            console.log('   ✅ Added "type" column to questions table.');
        } catch (e) {
            if (e.code === '42701') {
                console.log('   ℹ️  "type" column already exists.');
            } else {
                throw e;
            }
        }

        // 4. Seed Questions if empty
        const { rows: questionCount } = await client.query('SELECT COUNT(*) FROM questions');
        if (parseInt(questionCount[0].count) === 0) {
            console.log('🌱 Seeding initial questions...');
            const questions = [
                {
                    text: "What is the primary function of React's useEffect hook?",
                    options: ["State management", "Side effects", "Routing", "Styling"],
                    answer: "Side effects",
                    topic: "React"
                },
                {
                    text: "Which CSS property is used to create a flex container?",
                    options: ["display: block", "display: grid", "display: flex", "position: relative"],
                    answer: "display: flex",
                    topic: "CSS"
                },
                {
                    text: "In Next.js 13+, which directory is used for the App Router?",
                    options: ["/pages", "/src", "/app", "/components"],
                    answer: "/app",
                    topic: "Next.js"
                },
                {
                    text: "Which git command downloads a remote repository to your local machine?",
                    options: ["git push", "git commit", "git clone", "git pull"],
                    answer: "git clone",
                    topic: "Git"
                },
                {
                    text: "What does typescript add to JavaScript?",
                    options: ["New runtime features", "Static typing", "Browser compatibility", "Faster execution"],
                    answer: "Static typing",
                    topic: "TypeScript"
                }
            ];

            for (const q of questions) {
                await client.query(
                    'INSERT INTO questions (text, options, answer, topic) VALUES ($1, $2, $3, $4)',
                    [q.text, q.options, q.answer, q.topic]
                );
            }
            console.log(`   ✅ Seeded ${questions.length} questions.`);
        } else {
            console.log(`   ℹ️  Questions table already has ${questionCount[0].count} items. Skipping seed.`);
        }

        console.log('\n✅ Database migration completed successfully!');

    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();

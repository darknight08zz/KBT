const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:ujjwal0802@localhost:5432/kbt',
});

const initialQuestions = [
    {
        text: "Which of the following is NOT a built-in React Hook?",
        options: ["useState", "useEffect", "useFetch", "useContext"],
        answer: "useFetch",
        topic: "React"
    },
    {
        text: "What is the output of 2 + '2' in JavaScript?",
        options: ["4", "22", "NaN", "Error"],
        answer: "22",
        topic: "JavaScript"
    },
    {
        text: "Which CSS property is used to change the text color of an element?",
        options: ["font-color", "text-color", "color", "foreground-color"],
        answer: "color",
        topic: "CSS"
    },
    {
        text: "What does SQL stand for?",
        options: ["Structured Query Language", "Stylesheet Query Language", "Statement Question Language", "Structured Question List"],
        answer: "Structured Query Language",
        topic: "Databases"
    },
    {
        text: "Which HTTP method is typically used to update a resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        answer: "PUT",
        topic: "Networking"
    }
];

async function updateDb() {
    const client = await pool.connect();
    try {
        // Create Questions Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        options TEXT[] NOT NULL,
        answer TEXT NOT NULL,
        topic VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("Table 'questions' created.");

        // Seed Data
        for (const q of initialQuestions) {
            await client.query(
                'INSERT INTO questions (text, options, answer, topic) VALUES ($1, $2, $3, $4)',
                [q.text, q.options, q.answer, q.topic]
            );
        }
        console.log(`Seeded ${initialQuestions.length} questions.`);

    } catch (err) {
        console.error('Error updating DB:', err);
    } finally {
        client.release();
        pool.end();
    }
}

updateDb();

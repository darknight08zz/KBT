
// Mock question data
const questions = [
    { type: 'mcq', answer: 'A', difficulty: 'easy', id: 1 },
    { type: 'mcq', answer: 'B', difficulty: 'medium', id: 2 },
    { type: 'mcq', answer: 'C', difficulty: 'hard', id: 3 },
    { type: 'mcq', answer: 'D', difficulty: 'easy', id: 4 }, // For correct answer test
    { type: 'short_answer', answer: 'hello', keywords: ['hi', 'hello'], difficulty: 'medium', id: 5 }
];


const userAnswers = [
    'A', // Correct for Q1 (Easy) -> +5
    'B', // Correct for Q2 (Medium) -> +10
    'C', // Correct for Q3 (Hard) -> +15
    'Z', // Wrong for Q4 (Easy) -> 0
    'hi hello world' // Correct for Q5 (Medium) -> +10
];

function getPointsForDifficulty(difficulty) {
    switch (difficulty?.toLowerCase()) {
        case 'easy': return 5;
        case 'hard': return 15;
        case 'medium':
        default: return 10;
    }
}

function calculateScore(questions, selectedAnswers) {
    let score = 0;
    questions.forEach((q, index) => {
        const userAns = selectedAnswers[index];
        if (!userAns) return;

        console.log(`Processing Q${index + 1} (${q.type}, ${q.difficulty}): Ans '${userAns}' vs Correct '${q.answer}'`);

        let isCorrect = false;

        if (q.type === 'multiselect') {
            if (Array.isArray(userAns)) {
                if (JSON.stringify(userAns.sort()) === q.answer) {
                    isCorrect = true;
                }
            }
        } else if (q.type === 'short_answer' || q.type === 'long_answer') {
            const ansStr = typeof userAns === 'string' ? userAns.trim() : '';
            if (q.keywords && q.keywords.length > 0) {
                const keywordsArr = Array.isArray(q.keywords) ? q.keywords : q.keywords;
                const matchesAll = keywordsArr.every(k => ansStr.toLowerCase().includes(k.toLowerCase()));
                if (matchesAll) isCorrect = true;
            } else if (ansStr.toLowerCase() === q.answer.trim().toLowerCase()) {
                isCorrect = true;
            }
        } else {
            // MCQ: exact match
            if (userAns === q.answer) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            const pts = getPointsForDifficulty(q.difficulty);
            console.log(`  -> Correct! (+${pts} pts)`);
            score += pts;
        } else {
            console.log(`  -> Incorrect. No penalty (0 pts)`);
        }
    });
    return score;
}

const finalScore = calculateScore(questions, userAnswers);
console.log(`\nFinal Score: ${finalScore}`);

const expectedScore = 40; // 5 (Easy) + 10 (Medium) + 15 (Hard) + 0 (Wrong) + 10 (Medium)

console.log(`Expected Score: ${expectedScore}`);

if (Math.abs(finalScore - expectedScore) < 0.001) {
    console.log("SUCCESS: Difficulty-based scoring verified (Easy=5, Medium=10, Hard=15).");
} else {
    console.error("FAILURE: Scoring logic mismatch.");
    process.exit(1);
}

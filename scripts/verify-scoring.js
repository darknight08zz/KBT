
// Mock question data
const questions = [
    { type: 'mcq', answer: 'A', difficulty: 'easy', id: 1 },
    { type: 'mcq', answer: 'B', difficulty: 'medium', id: 2 },
    { type: 'mcq', answer: 'C', difficulty: 'hard', id: 3 },
    { type: 'mcq', answer: 'D', difficulty: 'easy', id: 4 }, // For correct answer test
    { type: 'short_answer', answer: 'hello', keywords: ['hi', 'hello'], difficulty: 'medium', id: 5 }
];


const userAnswers = [
    'Z', // Wrong for Q1 (Easy) -> -1
    'Z', // Wrong for Q2 (Medium) -> -0.5
    'Z', // Wrong for Q3 (Hard) -> 0
    'D', // Correct for Q4 -> +1
    'hi world'
];

function calculateScore(questions, selectedAnswers) {
    let score = 0;
    questions.forEach((q, index) => {
        const userAns = selectedAnswers[index];
        if (!userAns) return;

        console.log(`Processing Q${index + 1} (${q.type}, ${q.difficulty}): Ans '${userAns}' vs Correct '${q.answer}'`);

        if (q.type === 'multiselect') {
            if (Array.isArray(userAns)) {
                if (JSON.stringify(userAns.sort()) === q.answer) score += 1;
            }
        } else if (q.type === 'short_answer' || q.type === 'long_answer') {
            const ansStr = typeof userAns === 'string' ? userAns.trim() : '';
            if (q.keywords && q.keywords.length > 0) {
                const keywordsArr = Array.isArray(q.keywords) ? q.keywords : q.keywords;

                const matchesAll = keywordsArr.every(k => ansStr.toLowerCase().includes(k.toLowerCase())); // Wait, previous logic was 'every'?

                if (matchesAll) {
                    console.log(`  -> Keyword match! (+1)`);
                    score += 1;
                } else {
                    console.log(`  -> Keywords NOT matched.`);
                }
            }
            else if (ansStr.toLowerCase() === q.answer.trim().toLowerCase()) {
                score += 1;
            }
        } else {
            // MCQ
            if (userAns === q.answer) {
                console.log(`  -> Correct! (+1)`);
                score += 1;
            } else {
                // Negative marking logic
                console.log(`  -> Wrong! Calculating penalty for ${q.difficulty}...`);
                switch (q.difficulty?.toLowerCase()) {
                    case 'easy':
                        console.log(`    -> Easy penalty: -1`);
                        score -= 1;
                        break;
                    case 'medium':
                        console.log(`    -> Medium penalty: -0.5`);
                        score -= 0.5;
                        break;
                    case 'hard':
                        console.log(`    -> Hard penalty: 0`);
                        break;
                    default: break;
                }
            }
        }
    });
    return score;
}

const finalScore = calculateScore(questions, userAnswers);
console.log(`\nFinal Score: ${finalScore}`);

const expectedScore = -0.5;

console.log(`Expected Score: ${expectedScore}`);

if (Math.abs(finalScore - expectedScore) < 0.001) {
    console.log("SUCCESS: Scoring logic verified.");
} else {
    console.error("FAILURE: Scoring logic mismatch.");
    process.exit(1);
}

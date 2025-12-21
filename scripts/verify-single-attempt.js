const HOST = 'http://localhost:3000';

async function submit(username, score, year) {
    try {
        const res = await fetch(`${HOST}/api/leaderboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                score: score,
                time_taken: 30,
                year: year
            })
        });
        const d = await res.json();
        return { status: res.status, msg: d.message || d.error || 'Success' };
    } catch (e) {
        return { status: 'ERR', msg: e.message };
    }
}

async function verify() {
    const user = `single_attempt_user_${Date.now()}`;

    // 1. Submit Year 1
    const r1 = await submit(user, 10, '1st');
    console.log('Year 1 Submission:', r1);

    // 2. Submit Year 2 (Should FAIL/Already Recorded now)
    const r2 = await submit(user, 20, '2nd');
    console.log('Year 2 Submission:', r2);
}

verify();

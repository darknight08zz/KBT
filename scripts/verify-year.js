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
        if (res.ok) {
            const d = await res.json();
            return { status: res.status, msg: d.message || 'Success' };
        } else {
            return { status: res.status, msg: await res.text() };
        }
    } catch (e) {
        return { status: 'ERR', msg: e.message };
    }
}

async function verify() {
    const user = `year_test_user_${Date.now()}`;

    // 1. Submit Year 1
    const r1 = await submit(user, 10, '1st');
    console.log('Year 1 Submission:', r1);

    // 2. Submit Year 2 (Same User)
    const r2 = await submit(user, 20, '2nd');
    console.log('Year 2 Submission:', r2);

    // 3. Submit Year 1 Again (Should fail/already recorded)
    const r3 = await submit(user, 30, '1st');
    console.log('Year 1 Retry:', r3);
}

verify();

const HOST = 'http://localhost:3000';

async function submit(username, score) {
    try {
        const res = await fetch(`${HOST}/api/leaderboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                score: score,
                time_taken: 30
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

async function run() {
    // 1. Test Invalid Data (Expect 500 or 400)
    console.log('--- Test Invalid Data ---');
    // Sending string for integer score might cause DB error if not validated in route
    // But route defines interface, runtime it's just JS object.
    const r1 = await submit('invalid_user', 'NotANumber');
    console.log('Result:', r1);

    // 2. Test Concurrency (10 requests)
    console.log('\n--- Test Concurrency ---');
    const promises = [];
    for (let i = 0; i < 10; i++) {
        promises.push(submit(`concurrent_user_${Date.now()}_${i}`, 100));
    }
    const results = await Promise.all(promises);
    const failures = results.filter(r => r.status !== 200);
    console.log(`Sent 10 requests. Failures: ${failures.length}`);
    if (failures.length > 0) console.log(failures[0]);
}

run();

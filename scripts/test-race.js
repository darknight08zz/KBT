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

async function run() {
    const user = `race_user_${Date.now()}`;
    console.log(`Testing race condition for: ${user}`);

    // Fire 5 requests simultaneously
    const promises = [];
    for (let i = 0; i < 5; i++) {
        promises.push(submit(user, 100, '1st'));
    }

    const results = await Promise.all(promises);

    // Check results
    // We expect ALL to be status 200.
    // One should be "Success" (or implicit success), others "Score already recorded".
    // NONE should be 500.

    let successCount = 0;
    let recordedCount = 0;
    let errorCount = 0;

    results.forEach(r => {
        console.log(`Res: ${r.status} - ${r.msg}`);
        if (r.status === 200) {
            if (r.msg === 'Score already recorded') recordedCount++;
            else successCount++;
        } else {
            errorCount++;
        }
    });

    console.log('--- Summary ---');
    console.log(`Success (Inserted): ${successCount}`);
    console.log(`Already Recorded: ${recordedCount}`);
    console.log(`Errors: ${errorCount}`);

    if (errorCount === 0 && (successCount + recordedCount === 5)) {
        console.log('TEST PASSED: Race condition handled gracefully.');
    } else {
        console.log('TEST FAILED: Some requests failed significantly.');
    }
}

run();

const HOST = 'http://localhost:3000';

async function testFK() {
    // Generate a username that definitely doesn't exist (assuming users table has sane data)
    const username = 'non_existent_user_' + Math.random().toString(36).substring(7);
    console.log('Testing submission for NON-EXISTENT user:', username);

    try {
        const res = await fetch(`${HOST}/api/leaderboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                score: 50,
                time_taken: 30
            })
        });

        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);

        if (res.status === 500) {
            console.log('SUCCESS: Reproduced 500 error due to FK violation (likely).');
        } else if (res.status === 200) {
            console.log('FAILURE: Submission succeeded! FK constraint is MISSING or BROKEN.');
        } else {
            console.log('Unexpected status.');
        }

    } catch (err) {
        console.error('Fetch error:', err);
    }
}

testFK();

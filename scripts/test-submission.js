const HOST = 'http://localhost:3000';

async function testSubmission() {
    const username = 'test_user_' + Date.now();
    console.log('Testing submission for:', username);

    try {
        const res = await fetch(`${HOST}/api/leaderboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                score: 100,
                time_taken: 45
            })
        });

        console.log('Status:', res.status);
        if (res.status !== 200) {
            console.error('Submission FAILED');
            // Try to read text if json fails
            const text = await res.text();
            console.log('Response Body:', text);
        } else {
            const data = await res.json();
            console.log('Response:', data);
            console.log('Submission SUCCESS');
        }

    } catch (err) {
        console.error('Fetch error:', err);
    }
}

testSubmission();

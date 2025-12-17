async function testAuth() {
    const username = 'RoleUser_' + Date.now();
    const password = 'password123';
    const role = 'admin';

    try {
        console.log(`1. Registering ${username} as ${role}...`);
        const regRes = await fetch('http://localhost:3000/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'register', username, password, role })
        });
        console.log(`Reg Status: ${regRes.status}`);
        console.log("Reg Body:", await regRes.text());

        // Wait 2 seconds
        await new Promise(r => setTimeout(r, 2000));

        console.log(`2. Logging in ${username}...`);
        const loginRes = await fetch('http://localhost:3000/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', username, password })
        });
        console.log(`Login Status: ${loginRes.status}`);
        const loginData = await loginRes.json();
        console.log("Login Role:", loginData.role);

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testAuth();

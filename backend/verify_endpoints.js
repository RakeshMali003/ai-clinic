async function verify() {
    const BASE_URL = 'http://localhost:5000/api';
    console.log('--- API Verification Start ---');

    try {
        // 1. Check Connection
        console.log('Testing /api/system/check-connection...');
        const connRes = await fetch(`${BASE_URL}/system/check-connection`);
        const connData = await connRes.json();
        console.log('✅ Connection Check:', connData.message);

        // 2. Test Clinics GET
        console.log('Testing /api/clinics...');
        const clinicRes = await fetch(`${BASE_URL}/clinics`);
        const clinicData = await clinicRes.json();
        console.log('✅ Clinics GET:', clinicData.message);

        // 3. Test Doctors GET
        console.log('Testing /api/doctors...');
        const docRes = await fetch(`${BASE_URL}/doctors`);
        const docData = await docRes.json();
        if (docRes.ok) {
            console.log('✅ Doctors GET:', docData.message);
        } else {
            console.log('ℹ️ Doctors GET status:', docRes.status, docData.message);
        }

        console.log('--- API Verification Complete ---');
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    }
}

verify();

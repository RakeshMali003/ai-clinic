const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verifyRegistry() {
    try {
        await client.connect();
        console.log('Connected to database for final verification');

        // Verify patient creation (one that was likely failing)
        const patientTest = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'patients' AND column_name = 'email'
        `);
        if (patientTest.rows.length > 0) {
            console.log('✅ Patients table now correctly has the email column.');
        } else {
            console.error('❌ Patients table is still missing the email column!');
        }

        // Verify doctor creation requirements
        const doctorTest = await client.query(`
            SELECT is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'doctors' AND column_name = 'medical_council_reg_no'
        `);
        console.log(`Medical council reg no is nullable: ${doctorTest.rows[0].is_nullable}`);

        console.log('\n--- System state verified ---');

    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        await client.end();
    }
}

verifyRegistry();

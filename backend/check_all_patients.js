require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkAll() {
    try {
        console.log('=== ALL PATIENTS ===');
        const patients = await pool.query(`
            SELECT patient_id, user_id, full_name
            FROM patients
            ORDER BY patient_id DESC
        `);
        console.table(patients.rows);

        console.log('\n=== Users with patient role ===');
        const patientUsers = await pool.query(`
            SELECT user_id, full_name, email
            FROM users
            WHERE role = 'patient'
        `);
        console.table(patientUsers.rows);
        
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkAll();

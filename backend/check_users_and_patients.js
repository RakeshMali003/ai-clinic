require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkData() {
    try {
        console.log('=== USERS TABLE (Google users) ===');
        const users = await pool.query(`
            SELECT user_id, full_name, email, role, created_at 
            FROM users 
            WHERE email LIKE '%gmail.com'
            ORDER BY created_at DESC
        `);
        console.table(users.rows);

        console.log('\n=== PATIENTS TABLE ===');
        const patients = await pool.query(`
            SELECT p.patient_id, p.user_id, p.full_name, u.email 
            FROM patients p 
            JOIN users u ON p.user_id = u.user_id
        `);
        console.table(patients.rows);
        
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkData();

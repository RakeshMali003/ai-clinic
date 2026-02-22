require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkUsers() {
    try {
        const res = await pool.query(`
            SELECT user_id, full_name, email, role, created_at 
            FROM users 
            WHERE role = 'patient' 
            ORDER BY created_at DESC 
            LIMIT 10
        `);
        console.log('Recent patient users:');
        console.table(res.rows);
        
        // Also check patients table
        const patientRes = await pool.query(`
            SELECT patient_id, user_id, full_name, email 
            FROM patients 
            ORDER BY patient_id DESC 
            LIMIT 10
        `);
        console.log('Recent patients:');
        console.table(patientRes.rows);
        
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkUsers();

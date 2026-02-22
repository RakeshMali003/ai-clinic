require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkPatients() {
    try {
        const res = await pool.query(`
            SELECT p.patient_id, p.user_id, p.full_name, u.email 
            FROM patients p 
            JOIN users u ON p.user_id = u.user_id
        `);
        console.log('Patients with user info:');
        console.table(res.rows);
        
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkPatients();

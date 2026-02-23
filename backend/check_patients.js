require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkPatients() {
    try {
        const res = await pool.query(`
            SELECT * FROM patients LIMIT 10
        `);
        console.log('Patients in database:');
        console.table(res.rows);
        
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkPatients();

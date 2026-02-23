const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkStatusMaster() {
    try {
        const res = await pool.query(`
            SELECT * FROM appointment_status_master
        `);
        console.log('appointment_status_master table contents:');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkStatusMaster();

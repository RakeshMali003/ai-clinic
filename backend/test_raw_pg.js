const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testRaw() {
    console.log('--- Raw PG Test Start ---');
    try {
        const res = await pool.query('SELECT 1 as result');
        console.log('✅ SELECT 1 success:', res.rows);

        const res2 = await pool.query('SELECT * FROM clinics LIMIT 1');
        console.log('✅ SELECT clinics success:', res2.rows);
    } catch (err) {
        console.error('❌ Raw PG Error:');
        console.error(err);
    } finally {
        await pool.end();
    }
}

testRaw();

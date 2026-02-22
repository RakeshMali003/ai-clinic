require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
    try {
        console.log('=== PATIENTS TABLE SCHEMA ===');
        const columns = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'patients'
            ORDER BY ordinal_position
        `);
        console.table(columns.rows);
        
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkSchema();

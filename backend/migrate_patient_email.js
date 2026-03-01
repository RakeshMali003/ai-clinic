const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Check if email column exists in patients
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'patients' AND column_name = 'email'
        `);

        if (res.rows.length === 0) {
            console.log('Adding email column to patients table...');
            await client.query('ALTER TABLE patients ADD COLUMN email character varying(100);');
            console.log('✅ Column added successfully');
        } else {
            console.log('Email column already exists in patients table');
        }

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();

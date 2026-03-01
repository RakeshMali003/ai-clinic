const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Check patients table
        const patientCols = await client.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'patients'
            ORDER BY column_name
        `);
        console.log('\nPatients table columns:');
        patientCols.rows.forEach(col => {
            console.log(`- ${col.column_name} (${col.data_type}) [Nullable: ${col.is_nullable}]`);
        });

        const hasPatientEmail = patientCols.rows.some(col => col.column_name === 'email');
        console.log(`\nPatients has email column: ${hasPatientEmail}`);

        // Check doctors table
        const doctorCols = await client.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'doctors'
            ORDER BY column_name
        `);
        console.log('\nDoctors table columns:');
        doctorCols.rows.forEach(col => {
            console.log(`- ${col.column_name} (${col.data_type}) [Nullable: ${col.is_nullable}]`);
        });

        // Check if verification_details exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
               SELECT FROM information_schema.tables 
               WHERE  table_schema = 'public'
               AND    table_name   = 'verification_details'
            );
        `);
        console.log(`\nverification_details table exists: ${tableCheck.rows[0].exists}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkSchema();

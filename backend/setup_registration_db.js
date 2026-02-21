const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Fix column lengths in clinics table
        console.log('Fixing column lengths in clinics table...');
        await client.query('ALTER TABLE clinics ALTER COLUMN pin_code TYPE char(6);');
        await client.query('ALTER TABLE clinics ALTER COLUMN mobile TYPE char(10);');
        await client.query('ALTER TABLE clinics ALTER COLUMN pan_number TYPE char(10);');
        await client.query('ALTER TABLE clinics ALTER COLUMN gstin TYPE char(15);');

        // Fix column lengths in doctors table (just in case)
        console.log('Fixing column lengths in doctors table...');
        await client.query('ALTER TABLE doctors ALTER COLUMN mobile TYPE char(10);');
        await client.query('ALTER TABLE doctors ALTER COLUMN pan_number TYPE char(10);');
        await client.query('ALTER TABLE doctors ALTER COLUMN gstin TYPE char(15);');

        // Create verification_details table
        console.log('Creating verification_details table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS verification_details (
                id SERIAL PRIMARY KEY,
                doctor_id INTEGER REFERENCES doctors(id),
                clinic_id INTEGER REFERENCES clinics(id),
                account_name VARCHAR(150),
                account_number VARCHAR(50),
                ifsc_code VARCHAR(20),
                pan_number CHAR(10),
                gstin CHAR(15),
                verification_type VARCHAR(20) NOT NULL, -- 'DOCTOR' or 'CLINIC'
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Database setup completed successfully.');
    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();

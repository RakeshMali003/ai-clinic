const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function applyUpdates() {
    try {
        console.log('Applying database updates...');

        const updatesPath = path.join(__dirname, 'patient_module_updates.sql');
        const updates = fs.readFileSync(updatesPath, 'utf8');

        // Split by semicolon, but handle the DO block carefully
        // Simplified approach: Execute the whole block as one if possible or split by a more robust pattern
        // For simplicity and since there's a DO block, I'll try executing the whole script as one query string if it doesn't contain multiple incompatible commands.
        // Actually, many pg clients handle multiple statements separated by semicolons in one query.

        await pool.query(updates);

        console.log('✅ Database updates applied successfully');
    } catch (error) {
        console.error('❌ Database updates failed:', error);
    } finally {
        await pool.end();
    }
}

applyUpdates();

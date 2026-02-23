require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixPatients() {
    try {
        // Get all users with role 'patient' who don't have a patient record
        const usersResult = await pool.query(`
            SELECT u.user_id, u.full_name, u.email 
            FROM users u
            WHERE u.role = 'patient'
            AND NOT EXISTS (
                SELECT 1 FROM patients p WHERE p.user_id = u.user_id
            )
        `);
        
        console.log(`Found ${usersResult.rows.length} users without patient records`);
        
        for (const user of usersResult.rows) {
            const patientId = `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            
            await pool.query(`
                INSERT INTO patients (patient_id, user_id, full_name)
                VALUES ($1, $2, $3)
            `, [patientId, user.user_id, user.full_name]);
            
            console.log(`Created patient record for user: ${user.full_name} with patient_id: ${patientId}`);
        }
        
        console.log('Done!');
        
        // Verify
        const verifyResult = await pool.query('SELECT patient_id, user_id, full_name, email FROM patients');
        console.log('\nAll patients:');
        console.table(verifyResult.rows);
        
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

fixPatients();

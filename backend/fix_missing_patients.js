require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixMissingPatients() {
    try {
        console.log('=== Finding users without patient records ===');
        
        // Get users with patient role who don't have patient records
        const users = await pool.query(`
            SELECT u.user_id, u.full_name, u.email, u.role
            FROM users u
            WHERE u.role = 'patient'
            AND NOT EXISTS (
                SELECT 1 FROM patients p WHERE p.user_id = u.user_id
            )
        `);
        
        console.log(`Found ${users.rows.length} users without patient records`);
        console.table(users.rows);
        
        if (users.rows.length > 0) {
            console.log('\n=== Creating missing patient records ===');
            for (const user of users.rows) {
                const patientId = `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                
                try {
                    await pool.query(`
                        INSERT INTO patients (patient_id, user_id, full_name)
                        VALUES ($1, $2, $3)
                    `, [patientId, user.user_id, user.full_name]);
                    
                    console.log(`✅ Created patient record ${patientId} for user ${user.email}`);
                } catch (err) {
                    console.error(`❌ Error creating patient for ${user.email}:`, err.message);
                }
            }
        }
        
        // Verify the fix
        console.log('\n=== Final Verification ===');
        const finalPatients = await pool.query(`
            SELECT p.patient_id, p.user_id, p.full_name, u.email 
            FROM patients p 
            JOIN users u ON p.user_id = u.user_id
            WHERE u.role = 'patient'
        `);
        console.table(finalPatients.rows);
        
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

fixMissingPatients();

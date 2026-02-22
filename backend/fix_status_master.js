const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixStatusMaster() {
    try {
        // Insert common appointment status codes
        const statuses = [
            { status_code: 'scheduled', description: 'Appointment is scheduled' },
            { status_code: 'confirmed', description: 'Appointment has been confirmed' },
            { status_code: 'completed', description: 'Appointment was completed' },
            { status_code: 'cancelled', description: 'Appointment was cancelled' },
            { status_code: 'no-show', description: 'Patient did not show up' },
            { status_code: 'in-progress', description: 'Appointment is in progress' },
            { status_code: 'rescheduled', description: 'Appointment was rescheduled' }
        ];

        for (const status of statuses) {
            await pool.query(
                `INSERT INTO appointment_status_master (status_code, description) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [status.status_code, status.description]
            );
        }

        console.log('Successfully populated appointment_status_master table');

        // Verify the data
        const res = await pool.query(`SELECT * FROM appointment_status_master`);
        console.log('Current status codes:');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

fixStatusMaster();

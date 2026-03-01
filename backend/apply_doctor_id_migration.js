const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function applyMigration() {
    console.log('--- Applying SQL Migration: Adding doctor_id to patients ---');
    try {
        // Add doctor_id column if it doesn't exist
        await pool.query(`
            ALTER TABLE public.patients 
            ADD COLUMN IF NOT EXISTS doctor_id INTEGER;
        `);
        console.log('✅ Column doctor_id added to patients (if it didn\'t exist)');

        // Add foreign key constraint if it doesn't exist
        // Note: checking constraint existence is slightly more complex in PG, 
        // but we can try catch or use DO block.
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_patients_doctor') THEN
                    ALTER TABLE public.patients 
                    ADD CONSTRAINT fk_patients_doctor 
                    FOREIGN KEY (doctor_id) REFERENCES public.doctors(id);
                END IF;
            END $$;
        `);
        console.log('✅ Foreign key fk_patients_doctor added to patients (if it didn\'t exist)');

    } catch (err) {
        console.error('❌ SQL Migration Error:');
        console.error(err);
    } finally {
        await pool.end();
    }
}

applyMigration();

const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function fixDatabase() {
    try {
        await client.connect();
        console.log('Connected to database');

        const problematicItems = [
            { table: 'patients', constraint: 'uq_patients_abha' },
            { table: 'patients', constraint: 'uq_patients_phone' },
            { table: 'patients', constraint: 'patients_phone_key' },
            { table: 'patients', constraint: 'patients_abha_id_key' },
            { table: 'users', constraint: 'users_email_key' }
        ];

        for (const item of problematicItems) {
            console.log(`Dropping problematic constraint ${item.constraint} on ${item.table}...`);
            await client.query(`ALTER TABLE ${item.table} DROP CONSTRAINT IF EXISTS ${item.constraint} CASCADE;`).catch(e => console.log(`Could not drop constraint ${item.constraint}: ${e.message}`));

            console.log(`Dropping problematic index ${item.constraint}...`);
            await client.query(`DROP INDEX IF EXISTS ${item.constraint} CASCADE;`).catch(e => console.log(`Could not drop index ${item.constraint}: ${e.message}`));
        }

        console.log('Database fix completed.');
    } catch (err) {
        console.error('Error fixing database:', err);
    } finally {
        await client.end();
    }
}

fixDatabase();

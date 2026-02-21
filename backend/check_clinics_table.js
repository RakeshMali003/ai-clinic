require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function checkClinicsTable() {
    try {
        await prisma.$connect();
        console.log('✅ Connected to database');

        // Try to query clinics table
        const clinics = await prisma.$queryRaw`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'clinics' AND table_schema = 'public'
            ORDER BY ordinal_position;
        `;

        if (clinics.length === 0) {
            console.log('❌ Clinics table does not exist!');
        } else {
            console.log('\n✅ Clinics table columns:');
            clinics.forEach(col => {
                console.log(`  - ${col.column_name}: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}`);
            });
        }

        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await prisma.$disconnect();
    }
}

checkClinicsTable();

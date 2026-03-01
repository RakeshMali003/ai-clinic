const path = require('path');
console.log('--- Debug Start ---');
console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);

// const envPath = path.join(__dirname, '.env');
// console.log('Loading .env from:', envPath);
// require('dotenv').config({ path: envPath });
// console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

console.log('Loading Prisma Client...');
const { PrismaClient } = require('@prisma/client');
console.log('Loading pg Adapter...');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

console.log('Creating Pool...');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
console.log('Creating Adapter...');
const adapter = new PrismaPg(pool);

console.log('Instantiating PrismaClient...');
const prisma = new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error'],
});

console.log('Calling $connect()...');
prisma.$connect()
    .then(() => {
        console.log('✅ Connected!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error during connect:', err);
        process.exit(1);
    });

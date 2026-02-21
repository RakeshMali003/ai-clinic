const prisma = require('./config/database');

async function debug() {
    console.log('--- Prisma Debug Start ---');
    try {
        console.log('Testing queryRaw...');
        // Use a simpler query
        const raw = await prisma.$queryRawUnsafe('SELECT 1 as result');
        console.log('queryRaw success:', raw);

        console.log('Testing clinics.findMany()...');
        const clinics = await prisma.clinics.findMany({ take: 1 });
        console.log('clinics.findMany() success:', clinics);
    } catch (error) {
        console.error('❌ Prisma Error:');
        console.error(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    } finally {
        await prisma.$disconnect();
    }
}

debug();

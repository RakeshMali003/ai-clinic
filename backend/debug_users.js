const prisma = require('./config/database');

async function debug() {
    console.log('--- Prisma Debug Users Start ---');
    try {
        console.log('Testing users.findMany()...');
        const users = await prisma.users.findMany({ take: 1 });
        console.log('users.findMany() success:', users);
    } catch (error) {
        console.error('❌ Prisma Error for Users:');
        console.error(error.message);
    } finally {
        await prisma.$disconnect();
    }
}

debug();

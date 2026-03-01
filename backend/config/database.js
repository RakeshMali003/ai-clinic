const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

prisma.$connect()
    .then(async () => {
        console.log('✅ Prisma database connected successfully');
        // Simple check to ensure we can actually query
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database query verification successful');
    })
    .catch((err) => {
        console.error('❌ Prisma database connection error:', err);
        process.exit(-1);
    });

module.exports = prisma;

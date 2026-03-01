const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const doctors = await prisma.doctors.findMany();
        console.log('Doctors found:', doctors.length);
        console.log(JSON.stringify(doctors, null, 2));
    } catch (error) {
        console.error('Error fetching doctors:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAnalytics() {
    try {
        console.log('Testing Analytics Queries...');
        
        const apps = await prisma.appointments.findMany({ take: 1 });
        console.log('Sample appointment:', apps[0]);

        const daily = await prisma.$queryRaw`
            SELECT 
                TO_CHAR(appointment_date, 'Mon DD') as date,
                COUNT(*)::int as count
            FROM appointments
            GROUP BY TO_CHAR(appointment_date, 'Mon DD'), appointment_date
            ORDER BY appointment_date ASC
            LIMIT 5
        `;
        console.log('Daily Data:', daily);

        const revenue = await prisma.$queryRaw`
            SELECT 
                TO_CHAR(appointment_date, 'Mon') as month,
                SUM(earnings)::float as revenue
            FROM appointments
            GROUP BY TO_CHAR(appointment_date, 'Mon')
            LIMIT 5
        `;
        console.log('Revenue Data:', revenue);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

testAnalytics();

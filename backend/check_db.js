const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const clinics = await prisma.clinics.findMany({ take: 5 });
    console.log('Clinics:', clinics.map(c => ({ id: c.id, name: c.name })));
    const doctors = await prisma.doctors.findMany({ take: 5 });
    console.log('Doctors:', doctors.map(d => ({ id: d.id, name: d.name })));
    const appointments = await prisma.appointments.count();
    console.log('Total Appointments:', appointments);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

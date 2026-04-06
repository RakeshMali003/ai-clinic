const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const appts = await prisma.appointments.count();
  const patients = await prisma.patients.count();
  const doctors = await prisma.doctors.count();
  const clinics = await prisma.clinics.count();
  const mappings = await prisma.doctor_clinic_mapping.count();
  
  console.log({ appts, patients, doctors, clinics, mappings });
  
  const sampleAppt = await prisma.appointments.findFirst({
    include: { doctor: true, patient: true }
  });
  console.log('Sample Appt:', JSON.stringify(sampleAppt, null, 2));

  const reports = await prisma.appointments.aggregate({
    _sum: { earnings: true }
  });
  console.log('Total Revenue:', reports._sum.earnings);
}

main().catch(console.error).finally(() => prisma.$disconnect());

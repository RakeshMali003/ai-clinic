const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const counts = {
    appts: await prisma.appointments.count(),
    patients: await prisma.patients.count(),
    doctors: await prisma.doctors.count(),
    clinics: await prisma.clinics.count(),
    mappings: await prisma.doctor_clinic_mapping.count(),
    notifs: await prisma.notifications_unified.count()
  };
  console.log('SUMMARY_COUNTS:', JSON.stringify(counts));
  process.exit(0);
}
run();

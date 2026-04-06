const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const m = await prisma.doctor_clinic_mapping.findMany();
  console.log('MAPPINGS:', JSON.stringify(m, null, 2));
  process.exit(0);
}
run();

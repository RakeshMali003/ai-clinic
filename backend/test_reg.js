const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testRegistration() {
    console.log('Testing clinic registration...');
    try {
        const clinic = await prisma.clinics.create({
            data: {
                clinic_name: 'Test Clinic ' + Date.now(),
                address: 'Test Address',
                pin_code: '123456',
                city: 'Test City',
                state: 'Test State',
                mobile: '1234567890',
                email: 'test' + Date.now() + '@example.com',
                medical_council_reg_no: 'REG123',
                bank_account_name: 'Test Account',
                bank_account_number: '123456789',
                ifsc_code: 'SBIN0001234',
                pan_number: 'ABCDE1234F',
                gstin: '27ABCDE1234F1Z5',
                verification_status: 'PENDING'
            }
        });
        console.log('Clinic created successfully:', clinic.id);

        // Verify mirroring
        const verification = await prisma.verification_details.create({
            data: {
                clinic_id: clinic.id,
                account_name: 'Test Account',
                account_number: '123456789',
                ifsc_code: 'SBIN0001234',
                pan_number: 'ABCDE1234F',
                gstin: '27ABCDE1234F1Z5',
                verification_type: 'CLINIC'
            }
        });
        console.log('Verification details mirrored successfully:', verification.id);

        // Cleanup
        await prisma.verification_details.delete({ where: { id: verification.id } });
        await prisma.clinics.delete({ where: { id: clinic.id } });
        console.log('Cleanup completed.');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testRegistration();

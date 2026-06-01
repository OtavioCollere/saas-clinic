import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
import { seedClinics } from './seeds/clinics.seed';
import { seedClinicMemberships } from './seeds/clinic-memberships.seed';
import { seedFranchises } from './seeds/franchises.seed';
import { seedProfessionals } from './seeds/professionals.seed';
import { seedProcedures } from './seeds/procedures.seed';
import { seedPatients } from './seeds/patients.seed';
import { seedAppointments } from './seeds/appointments.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    const users = await seedUsers(prisma);

    const clinic = await seedClinics(prisma, users.owner.id);

    await seedClinicMemberships(
      prisma,
      users.owner.id,
      clinic.id,
      users.professionals.map((u) => u.id)
    );

    const franchise = await seedFranchises(prisma, clinic.id);

    const professionals = await seedProfessionals(
      prisma,
      users.professionals,
      franchise.id
    );

    const procedures = await seedProcedures(prisma, franchise.id);

    const patients = await seedPatients(prisma, clinic.id, users.patientUsers);

    await seedAppointments(
      prisma,
      professionals,
      franchise.id,
      patients,
      procedures
    );

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📝 Seed data summary:');
    console.log(`   - Users: ${4 + users.patientUsers.length}`);
    console.log(`   - Clinics: 1`);
    console.log(`   - Clinic Memberships: ${1 + users.professionals.length}`);
    console.log(`   - Franchises: 1`);
    console.log(`   - Professionals: 3`);
    console.log(`   - Procedures: 5`);
    console.log(`   - Patients: 30`);
    console.log(`   - Appointments: 26 (5 hoje, 3 semana passada, 10 este mês, 8 mês passado)`);
    console.log('\n🔑 Default credentials:');
    console.log('   - Owner: owner@clinic.com / 123456');
    console.log('   - Member/Prof 1: member@clinic.com / 123456');
    console.log('   - Prof 2: professional2@clinic.com / 123456');
    console.log('   - Prof 3: professional3@clinic.com / 123456');
    console.log('   - Patients: patient1@clinic.com a patient30@clinic.com / 123456');
  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


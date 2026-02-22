import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
import { seedClinics } from './seeds/clinics.seed';
import { seedClinicMemberships } from './seeds/clinic-memberships.seed';
import { seedFranchises } from './seeds/franchises.seed';
import { seedProfessionals } from './seeds/professionals.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Seed users first (they might be referenced by other seeds)
    const users = await seedUsers(prisma);

    // Seed clinic with owner
    const clinic = await seedClinics(prisma, users.owner.id);

    // Seed clinic membership (owner membership)
    await seedClinicMemberships(prisma, users.owner.id, clinic.id);

    // Seed franchise
    const franchise = await seedFranchises(prisma, clinic.id);

    // Seed professional (using member user)
    await seedProfessionals(prisma, users.member.id, franchise.id);

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📝 Seed data summary:');
    console.log(`   - Users: 2`);
    console.log(`   - Clinics: 1`);
    console.log(`   - Clinic Memberships: 1`);
    console.log(`   - Franchises: 1`);
    console.log(`   - Professionals: 1`);
    console.log('\n🔑 Default credentials:');
    console.log('   - Owner: owner@clinic.com / 123456');
    console.log('   - Member: member@clinic.com / 123456');
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


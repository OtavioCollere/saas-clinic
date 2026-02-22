import { PrismaClient } from '@prisma/client';

export async function seedFranchises(prisma: PrismaClient, clinicId: string) {
  console.log('🏢 Seeding franchises...');

  const franchise = await prisma.franchise.upsert({
    where: { id: 'franchise-seed-id' },
    update: {},
    create: {
      id: 'franchise-seed-id',
      name: 'Clínica Principal',
      clinicId: clinicId,
      address: 'Rua Principal, 123',
      zipCode: '12345-678',
      status: 'ACTIVE',
      description: 'Franquia principal da clínica',
    },
  });

  console.log(`✅ Created/updated 1 franchise`);
  return franchise;
}


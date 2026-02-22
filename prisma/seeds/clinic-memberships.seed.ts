import { PrismaClient } from '@prisma/client';

export async function seedClinicMemberships(
  prisma: PrismaClient,
  userId: string,
  clinicId: string
) {
  console.log('👥 Seeding clinic memberships...');

  const membership = await prisma.clinicMembership.upsert({
    where: {
      userId_clinicId: {
        userId: userId,
        clinicId: clinicId,
      },
    },
    update: {},
    create: {
      userId: userId,
      clinicId: clinicId,
      role: 'OWNER',
    },
  });

  console.log(`✅ Created/updated 1 clinic membership`);
  return membership;
}





import { PrismaClient } from '@prisma/client';

export async function seedClinicMemberships(
  prisma: PrismaClient,
  ownerId: string,
  clinicId: string,
  professionalUserIds: string[] = []
) {
  console.log('👥 Seeding clinic memberships...');

  const owner = await prisma.clinicMembership.upsert({
    where: {
      userId_clinicId: {
        userId: ownerId,
        clinicId,
      },
    },
    update: {},
    create: {
      userId: ownerId,
      clinicId,
      role: 'OWNER',
    },
  });

  for (const userId of professionalUserIds) {
    await prisma.clinicMembership.upsert({
      where: {
        userId_clinicId: {
          userId,
          clinicId,
        },
      },
      update: {},
      create: {
        userId,
        clinicId,
        role: 'PROFESSIONAL',
      },
    });
  }

  const total = 1 + professionalUserIds.length;
  console.log(`✅ Created/updated ${total} clinic memberships`);
  return owner;
}





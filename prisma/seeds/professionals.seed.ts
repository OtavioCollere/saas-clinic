import { PrismaClient } from '@prisma/client';

export async function seedProfessionals(
  prisma: PrismaClient,
  userId: string,
  franchiseId: string
) {
  console.log('👨‍⚕️ Seeding professionals...');

  const professional = await prisma.professional.upsert({
    where: {
      userId_franchiseId: {
        userId: userId,
        franchiseId: franchiseId,
      },
    },
    update: {},
    create: {
      userId: userId,
      franchiseId: franchiseId,
      profession: 'MEDICO',
      council: 'CRM',
      councilNumber: '123456',
      councilState: 'SP',
    },
  });

  console.log(`✅ Created/updated 1 professional`);
  return professional;
}


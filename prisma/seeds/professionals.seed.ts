import { PrismaClient } from '@prisma/client';

interface ProfessionalUser {
  id: string;
}

const PROFESSIONAL_CONFIG = [
  { councilNumber: '123456', councilState: 'SP' },
  { councilNumber: '234567', councilState: 'SP' },
  { councilNumber: '345678', councilState: 'SP' },
];

export async function seedProfessionals(
  prisma: PrismaClient,
  professionalUsers: ProfessionalUser[],
  franchiseId: string
) {
  console.log('👨‍⚕️ Seeding professionals...');

  const professionals = [];
  for (let i = 0; i < professionalUsers.length; i++) {
    const user = professionalUsers[i];
    const config = PROFESSIONAL_CONFIG[i] ?? PROFESSIONAL_CONFIG[0];
    const professional = await prisma.professional.upsert({
      where: {
        userId_franchiseId: {
          userId: user.id,
          franchiseId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        franchiseId,
        profession: 'MEDICO',
        council: 'CRM',
        councilNumber: config.councilNumber,
        councilState: config.councilState,
      },
    });
    professionals.push(professional);
  }

  console.log(`✅ Created/updated ${professionals.length} professionals`);
  return professionals;
}


import { PrismaClient } from '@prisma/client';

interface ProfessionalUser {
  id: string;
}

const CONFIGS = [
  { profession: 'MEDICO',    council: 'CRM',  councilNumber: '42871', councilState: 'PR' },
  { profession: 'BIOMEDICO', council: 'CRBM', councilNumber: '3890',  councilState: 'PR' },
  { profession: 'MEDICO',    council: 'CRM',  councilNumber: '57364', councilState: 'PR' },
];

export async function seedProfessionals(
  prisma: PrismaClient,
  professionalUsers: ProfessionalUser[],
  franchiseId: string
) {
  console.log('👨‍⚕️ Criando profissionais...');

  const professionals = [];
  for (let i = 0; i < professionalUsers.length; i++) {
    const cfg = CONFIGS[i] ?? CONFIGS[0];
    const professional = await prisma.professional.create({
      data: {
        userId: professionalUsers[i].id,
        franchiseId,
        profession: cfg.profession,
        council: cfg.council,
        councilNumber: cfg.councilNumber,
        councilState: cfg.councilState,
      },
    });
    professionals.push(professional);
  }

  console.log(`✅ ${professionals.length} profissionais criados`);
  return professionals;
}

import { PrismaClient } from '@prisma/client';

export async function seedClinics(prisma: PrismaClient, ownerId: string) {
  console.log('🏥 Criando clínica...');

  const clinic = await prisma.clinic.create({
    data: {
      ownerId,
      name: 'Cliniker Estética Médica',
      slug: 'bianca-collere',
      cnpj: '45678901000123',
      description: 'Clínica especializada em estética médica avançada',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Clínica criada (slug: ${clinic.slug})`);
  return clinic;
}

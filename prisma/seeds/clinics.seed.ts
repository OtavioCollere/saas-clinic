import { PrismaClient } from '@prisma/client';

export async function seedClinics(prisma: PrismaClient, ownerId: string) {
  console.log('🏥 Seeding clinics...');

  const clinic = await prisma.clinic.upsert({
    where: { slug: 'clinica-principal' },
    update: {},
    create: {
      ownerId: ownerId,
      name: 'Clínica Principal',
      slug: 'clinica-principal',
      cnpj: '12345678000190',
      description: 'Clínica de estética principal',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Created/updated 1 clinic`);
  return clinic;
}





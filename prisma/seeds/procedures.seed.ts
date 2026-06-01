import { PrismaClient } from '@prisma/client';

const PROCEDURES = [
  { id: 'procedure-seed-botox', name: 'Botox', price: 800 },
  { id: 'procedure-seed-preenchimento-labial', name: 'Preenchimento labial', price: 1200 },
  { id: 'procedure-seed-limpeza-de-pele', name: 'Limpeza de pele', price: 350 },
  { id: 'procedure-seed-microagulhamento', name: 'Microagulhamento', price: 600 },
  { id: 'procedure-seed-peeling-quimico', name: 'Peeling químico', price: 450 },
];

export async function seedProcedures(
  prisma: PrismaClient,
  franchiseId: string
) {
  console.log('💉 Seeding procedures...');

  for (const proc of PROCEDURES) {
    await prisma.procedure.upsert({
      where: { id: proc.id },
      update: {},
      create: {
        id: proc.id,
        franchiseId,
        name: proc.name,
        price: proc.price,
        notes: null,
        status: 'ACTIVE',
      },
    });
  }

  console.log(`✅ Created/updated ${PROCEDURES.length} procedures`);
  return prisma.procedure.findMany({
    where: { franchiseId },
  });
}

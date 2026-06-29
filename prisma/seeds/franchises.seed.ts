import { PrismaClient } from '@prisma/client';

export async function seedFranchises(prisma: PrismaClient, clinicId: string) {
  console.log('🏢 Criando franquia...');

  const franchise = await prisma.franchise.create({
    data: {
      clinicId,
      name: 'Unidade Batel',
      address: 'Alameda Dom Pedro II, 1285 - Batel',
      zipCode: '80420-090',
      status: 'ACTIVE',
      description: 'Unidade principal — Batel, Curitiba',
    },
  });

  console.log(`✅ Franquia criada (${franchise.name})`);
  return franchise;
}

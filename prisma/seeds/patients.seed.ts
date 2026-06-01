import { PrismaClient } from '@prisma/client';

const ADDRESSES = [
  'Rua das Flores, 100',
  'Av. Brasil, 500',
  'Rua Augusta, 2000',
  'Rua Oscar Freire, 300',
  'Av. Paulista, 1000',
  'Rua Consolação, 2500',
  'Rua Bela Cintra, 800',
  'Av. Rebouças, 1500',
  'Rua Haddock Lobo, 400',
  'Rua da Consolação, 3300',
  'Rua Teodoro Sampaio, 200',
  'Rua Pamplona, 600',
  'Rua Bela Cintra, 1100',
  'Rua Estados Unidos, 100',
  'Rua da Consolação, 2900',
  'Rua Oscar Freire, 800',
  'Rua Haddock Lobo, 900',
  'Av. Brasil, 1200',
  'Rua Augusta, 1500',
  'Rua das Flores, 200',
  'Av. Paulista, 2000',
  'Rua Consolação, 1200',
  'Rua Bela Cintra, 500',
  'Av. Rebouças, 800',
  'Rua Teodoro Sampaio, 1500',
  'Rua Pamplona, 300',
  'Rua Estados Unidos, 250',
  'Rua Oscar Freire, 1200',
  'Rua da Consolação, 1800',
  'Av. Brasil, 800',
];

function birthDateForIndex(index: number): Date {
  const year = 1965 + (index % 40);
  const month = index % 12;
  const day = 1 + (index % 28);
  return new Date(year, month, day);
}

function createdAtForIndex(index: number, today: Date): Date {
  const base = today.getDate();
  if (index < 20) {
    // spread across last month: -45 to -32 days ago
    const offset = -45 + (index % 14);
    return new Date(today.getFullYear(), today.getMonth(), base + offset);
  }
  // spread across this month: -15 to -1 days ago
  const offset = -15 + ((index - 20) % 15);
  return new Date(today.getFullYear(), today.getMonth(), base + offset);
}

export async function seedPatients(
  prisma: PrismaClient,
  clinicId: string,
  patientUsers: Array<{ id: string; name: string }>
) {
  console.log('🩺 Seeding patients...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < patientUsers.length; i++) {
    const user = patientUsers[i];
    const address = ADDRESSES[i % ADDRESSES.length];
    const createdAt = createdAtForIndex(i, today);
    await prisma.patient.upsert({
      where: { id: `patient-seed-${i + 1}` },
      update: { createdAt },
      create: {
        id: `patient-seed-${i + 1}`,
        clinicId,
        userId: user.id,
        name: user.name,
        birthDay: birthDateForIndex(i),
        address,
        zipCode: '01310-100',
        createdAt,
      },
    });
  }

  console.log(`✅ Created/updated ${patientUsers.length} patients`);
  return prisma.patient.findMany({
    where: { clinicId },
  });
}

import { PrismaClient } from '@prisma/client';

interface SeedMembershipsInput {
  ownerId: string;
  clinicId: string;
  collaboratorId: string;
  professionalUserIds: string[];
  patientUserIds: string[];
}

export async function seedClinicMemberships(
  prisma: PrismaClient,
  input: SeedMembershipsInput
) {
  console.log('👥 Criando memberships...');

  await prisma.clinicMembership.create({
    data: { userId: input.ownerId, clinicId: input.clinicId, role: 'OWNER' },
  });

  await prisma.clinicMembership.create({
    data: { userId: input.collaboratorId, clinicId: input.clinicId, role: 'COLLABORATOR' },
  });

  for (const userId of input.professionalUserIds) {
    await prisma.clinicMembership.create({
      data: { userId, clinicId: input.clinicId, role: 'PROFESSIONAL' },
    });
  }

  for (const userId of input.patientUserIds) {
    await prisma.clinicMembership.create({
      data: { userId, clinicId: input.clinicId, role: 'PATIENT' },
    });
  }

  const total = 2 + input.professionalUserIds.length + input.patientUserIds.length;
  console.log(`✅ ${total} memberships criados`);
}

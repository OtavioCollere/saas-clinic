import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
import { seedClinics } from './seeds/clinics.seed';
import { seedClinicMemberships } from './seeds/clinic-memberships.seed';
import { seedFranchises } from './seeds/franchises.seed';
import { seedProfessionals } from './seeds/professionals.seed';
import { seedProcedures } from './seeds/procedures.seed';
import { seedPatients } from './seeds/patients.seed';
import { seedAppointments } from './seeds/appointments.seed';
import { seedAnamnesis } from './seeds/anamnesis.seed';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🗑️  Limpando banco de dados...');
  await prisma.serviceOrderItem.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.whatsAppConversation.deleteMany();
  await prisma.appointmentItem.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.anamnesisHistory.deleteMany();
  await prisma.anamnesis.deleteMany();
  await prisma.procedure.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.franchise.deleteMany();
  await prisma.clinicMembership.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.session.deleteMany();
  await prisma.mfaSettings.deleteMany();
  await prisma.emailVerification.deleteMany();
  await prisma.passwordVerification.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Banco limpo\n');
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    await cleanDatabase();

    const users = await seedUsers(prisma);
    const clinic = await seedClinics(prisma, users.owner.id);

    await seedClinicMemberships(prisma, {
      ownerId: users.owner.id,
      clinicId: clinic.id,
      collaboratorId: users.collaborator.id,
      professionalUserIds: users.professionals.map((u) => u.id),
      patientUserIds: users.patientUsers.map((u) => u.id),
    });

    const franchise = await seedFranchises(prisma, clinic.id);
    const professionals = await seedProfessionals(prisma, users.professionals, franchise.id);
    const procedures = await seedProcedures(prisma, franchise.id);
    const patients = await seedPatients(prisma, clinic.id, users.patientUsers);

    await seedAppointments(prisma, professionals, franchise.id, patients, procedures);
    await seedAnamnesis(prisma, patients);

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📋 Resumo:');
    console.log(`   Usuários:       ${5 + users.patientUsers.length}`);
    console.log(`   Clínica:        1  (slug: bianca-collere)`);
    console.log(`   Franquia:       1  (Unidade Batel)`);
    console.log(`   Profissionais:  3`);
    console.log(`   Procedimentos:  10`);
    console.log(`   Pacientes:      50`);
    console.log(`   Agendamentos:   ~126 (4 meses de histórico + próxima semana)`);
    console.log('\n🔑 Credenciais (senha: 123456):');
    console.log('   Owner:          owner@cliniker.com.br');
    console.log('   Colaborador:    admin@cliniker.com.br');
    console.log('   Profissional 1: anacarolina@cliniker.com.br');
    console.log('   Profissional 2: juliana@cliniker.com.br');
    console.log('   Profissional 3: ricardo@cliniker.com.br');
    console.log('   Pacientes:      paciente01@cliniker.com.br … paciente50@cliniker.com.br');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../helpers/hash-password';

export async function seedUsers(prisma: PrismaClient) {
  console.log('👤 Seeding users...');

  const defaultPassword = await hashPassword('123456');

  const owner = await prisma.user.upsert({
    where: { cpf: '12345678900' },
    update: { email: 'owner@clinic.com', name: 'Clinic Owner', password: defaultPassword },
    create: {
      name: 'Clinic Owner',
      email: 'owner@clinic.com',
      cpf: '12345678900',
      password: defaultPassword,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  const member = await prisma.user.upsert({
    where: { cpf: '12345678901' },
    update: { email: 'member@clinic.com', name: 'Clinic Member', password: defaultPassword },
    create: {
      name: 'Clinic Member',
      email: 'member@clinic.com',
      cpf: '12345678901',
      password: defaultPassword,
      role: 'MEMBER',
      isEmailVerified: true,
    },
  });

  const professional2 = await prisma.user.upsert({
    where: { cpf: '12345678902' },
    update: { email: 'professional2@clinic.com', name: 'Dra. Maria Silva', password: defaultPassword },
    create: {
      name: 'Dra. Maria Silva',
      email: 'professional2@clinic.com',
      cpf: '12345678902',
      password: defaultPassword,
      role: 'MEMBER',
      isEmailVerified: true,
    },
  });

  const professional3 = await prisma.user.upsert({
    where: { cpf: '12345678903' },
    update: { email: 'professional3@clinic.com', name: 'Dr. Carlos Oliveira', password: defaultPassword },
    create: {
      name: 'Dr. Carlos Oliveira',
      email: 'professional3@clinic.com',
      cpf: '12345678903',
      password: defaultPassword,
      role: 'MEMBER',
      isEmailVerified: true,
    },
  });

  const patientNames = [
    'Ana Paula Santos', 'Bruno Ferreira', 'Carla Mendes', 'Daniel Costa',
    'Elena Rodrigues', 'Felipe Lima', 'Gabriela Souza', 'Henrique Alves',
    'Isabela Pereira', 'João Pedro Ribeiro', 'Karina Martins', 'Lucas Gomes',
    'Mariana Torres', 'Nathan Campos', 'Olivia Barbosa', 'Pedro Henrique Dias',
    'Quintino Rocha', 'Rafaela Nunes', 'Sérgio Cardoso', 'Tatiana Freitas',
    'Ulisses Moreira', 'Vanessa Pinto', 'Wagner Teixeira', 'Ximena Castro',
    'Yuri Araújo', 'Zélia Lopes', 'Amanda Vieira', 'Bernardo Azevedo',
    'Camila Cavalcanti', 'Diego Monteiro',
  ];

  const patientUsers: Array<{ id: string; name: string }> = [];
  for (let i = 0; i < patientNames.length; i++) {
    const email = `patient${i + 1}@clinic.com`;
    const cpf = `123456789${String(i + 10).padStart(2, '0')}`;
    const user = await prisma.user.upsert({
      where: { cpf },
      update: { email, name: patientNames[i], password: defaultPassword },
      create: {
        name: patientNames[i],
        email,
        cpf,
        password: defaultPassword,
        role: 'MEMBER',
        isEmailVerified: true,
      },
    });
    patientUsers.push({ id: user.id, name: user.name });
  }

  // Força atualização das senhas (hash bcrypt) para garantir login
  const allEmails = [
    'owner@clinic.com',
    'member@clinic.com',
    'professional2@clinic.com',
    'professional3@clinic.com',
    ...patientNames.map((_, i) => `patient${i + 1}@clinic.com`),
  ];
  await prisma.user.updateMany({
    where: { email: { in: allEmails } },
    data: { password: defaultPassword },
  });

  console.log(`✅ Created/updated ${4 + patientUsers.length} users (senhas em bcrypt)`);
  return {
    owner,
    member,
    professional2,
    professional3,
    professionals: [member, professional2, professional3],
    patientUsers,
  };
}





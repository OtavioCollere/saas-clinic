import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../helpers/hash-password';

export async function seedUsers(prisma: PrismaClient) {
  console.log('👤 Seeding users...');

  const defaultPassword = await hashPassword('123456');

  const owner = await prisma.user.upsert({
    where: { email: 'owner@clinic.com' },
    update: {},
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
    where: { email: 'member@clinic.com' },
    update: {},
    create: {
      name: 'Clinic Member',
      email: 'member@clinic.com',
      cpf: '12345678901',
      password: defaultPassword,
      role: 'MEMBER',
      isEmailVerified: true,
    },
  });

  console.log(`✅ Created/updated ${2} users`);
  return { owner, member };
}





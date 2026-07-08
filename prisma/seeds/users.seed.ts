import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../helpers/hash-password';

const PATIENT_NAMES = [
  'Ana Paula Santos',     'Beatriz Oliveira',      'Camila Ferreira',
  'Daniela Costa',        'Elena Rodrigues',        'Fernanda Lima',
  'Gabriela Souza',       'Helena Alves',           'Isabela Pereira',
  'Joana Ribeiro',        'Karina Martins',         'Laura Gomes',
  'Mariana Torres',       'Natalia Campos',          'Olivia Barbosa',
  'Patricia Dias',        'Rafaela Nunes',           'Sandra Freitas',
  'Tatiana Moreira',      'Valentina Pinto',         'Viviane Castro',
  'Yasmin Araújo',        'Amanda Vieira',           'Bianca Azevedo',
  'Claudia Cavalcanti',   'Denise Monteiro',         'Elisa Carvalho',
  'Flavia Borges',        'Giovanna Teixeira',       'Heloisa Fonseca',
  'André Silva',          'Bruno Santos',            'Carlos Ferreira',
  'Diego Pereira',        'Eduardo Lima',            'Felipe Costa',
  'Gustavo Alves',        'Henrique Ribeiro',        'Igor Martins',
  'João Pedro Gomes',     'Lucas Rocha',             'Miguel Torres',
  'Nicolas Campos',       'Otávio Barbosa',          'Pedro Henrique Dias',
  'Rafael Nunes',         'Sérgio Cardoso',          'Thiago Freitas',
  'Vitor Moreira',        'Wagner Teixeira',
];

export async function seedUsers(prisma: PrismaClient) {
  console.log('👤 Criando usuários...');

  const pwd = await hashPassword('123456');

  // Superadmin (acesso ao painel /admin)
  await prisma.user.upsert({
    where: { email: 'otaviosk59@gmail.com' },
    update: {},
    create: {
      name: 'Otávio (Superadmin)',
      email: 'otaviosk59@gmail.com',
      cpf: '00000000001',
      password: pwd,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: 'Dra. Bianca Collere',
      email: 'owner@cliniker.com.br',
      cpf: '99900000001',
      phone: '41988390220',
      password: pwd,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  const collaborator = await prisma.user.create({
    data: {
      name: 'Fernanda Lima',
      email: 'admin@cliniker.com.br',
      cpf: '99900000002',
      phone: '41991110001',
      password: pwd,
      role: 'MEMBER',
      isEmailVerified: true,
    },
  });

  const prof1 = await prisma.user.create({
    data: {
      name: 'Dra. Ana Carolina Ferreira',
      email: 'anacarolina@cliniker.com.br',
      cpf: '99900000003',
      phone: '41991110002',
      password: pwd,
      role: 'MEMBER',
      isEmailVerified: true,
    },
  });

  const prof2 = await prisma.user.create({
    data: {
      name: 'Dra. Juliana Mendes Rocha',
      email: 'juliana@cliniker.com.br',
      cpf: '99900000004',
      phone: '41991110003',
      password: pwd,
      role: 'MEMBER',
      isEmailVerified: true,
    },
  });

  const prof3 = await prisma.user.create({
    data: {
      name: 'Dr. Ricardo Santos Lima',
      email: 'ricardo@cliniker.com.br',
      cpf: '99900000005',
      phone: '41991110004',
      password: pwd,
      role: 'MEMBER',
      isEmailVerified: true,
    },
  });

  const patientUsers: Array<{ id: string; name: string }> = [];
  for (let i = 0; i < PATIENT_NAMES.length; i++) {
    const name = PATIENT_NAMES[i];
    const index = String(i + 1).padStart(2, '0');
    const user = await prisma.user.create({
      data: {
        name,
        email: `paciente${index}@cliniker.com.br`,
        cpf: `88800000${String(i).padStart(3, '0')}`,
        password: pwd,
        role: 'MEMBER',
        isEmailVerified: true,
      },
    });
    patientUsers.push({ id: user.id, name: user.name });
  }

  console.log(`✅ ${5 + patientUsers.length} usuários criados`);
  return {
    owner,
    collaborator,
    professionals: [prof1, prof2, prof3],
    patientUsers,
  };
}

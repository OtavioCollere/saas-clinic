import { PrismaClient } from '@prisma/client';

const ADDRESSES = [
  'Rua Mateus Leme, 1200 — Centro',         'Av. Batel, 890 — Batel',
  'Rua Comendador Araújo, 540 — Batel',     'Al. Dom Pedro II, 330 — Batel',
  'Rua XV de Novembro, 700 — Centro',       'Av. Visconde de Guarapuava, 1150 — Centro',
  'Rua Padre Agostinho, 2230 — Mercês',     'Rua Rockfeller, 580 — Portão',
  'Av. República Argentina, 3800 — Novo Mundo', 'Rua João Negrão, 250 — Centro',
  'Rua Emiliano Perneta, 450 — Centro',     'Al. Augusto Stellfeld, 400 — Batel',
  'Rua Carlos de Carvalho, 900 — Centro',   'Av. Sete de Setembro, 3640 — Água Verde',
  'Rua Desembargador Motta, 1100 — Água Verde', 'Av. Iguaçu, 2300 — Água Verde',
  'Rua Padre Camargo, 1400 — Alto da Glória', 'Rua Alfredo Bufren, 120 — Centro',
  'Rua Marechal Floriano, 870 — Centro',    'Av. Marechal Deodoro, 400 — Centro',
  'Rua Saldanha Marinho, 800 — Centro',     'Al. Cabral, 1750 — Cabral',
  'Rua Conselheiro Laurindo, 320 — São Francisco', 'Rua Ébano Pereira, 200 — Centro',
  'Av. Cândido de Abreu, 2200 — Centro Cívico', 'Rua das Flores, 500 — Centro',
  'Rua Itupava, 600 — Alto da Rua XV',      'Rua Coronel Dulcídio, 1800 — Água Verde',
  'Av. Manoel Ribas, 2400 — Santa Felicidade', 'Rua Nicarágua, 300 — Bacacheri',
  'Rua Amazonas, 950 — Água Verde',         'Av. Winston Churchill, 700 — Bacacheri',
  'Rua Jacarezinho, 480 — Bigorrilho',      'Rua Tibagi, 1500 — Centro',
  'Av. Anita Garibaldi, 1800 — Juvevê',     'Rua Inácio Lustosa, 1200 — São Francisco',
  'Rua Cruz Machado, 610 — Centro',         'Av. Iguaçu, 4400 — Rebouças',
  'Rua Visconde de Nácar, 1040 — Centro',   'Rua José Loureiro, 600 — Centro',
  'Rua Dr. Muricy, 900 — Centro',           'Av. Batel, 3200 — Água Verde',
  'Rua Emilio de Menezes, 480 — Prado Velho', 'Rua Dom Pedro II, 1100 — Água Verde',
  'Rua Mamoré, 380 — Água Verde',           'Al. Prudente de Moraes, 560 — Batel',
  'Rua Rio de Janeiro, 2100 — Água Verde',  'Rua Ernani Cartaxo, 950 — Champagnat',
  'Av. Presidente Kennedy, 1600 — Água Verde', 'Rua Visconde do Rio Branco, 710 — Centro',
];

function birthDate(index: number): Date {
  const year = 1960 + (index % 42);
  const month = (index * 3) % 12;
  const day = 1 + (index % 27);
  return new Date(year, month, day);
}

export async function seedPatients(
  prisma: PrismaClient,
  clinicId: string,
  patientUsers: Array<{ id: string; name: string }>
) {
  console.log('🩺 Criando pacientes...');

  for (let i = 0; i < patientUsers.length; i++) {
    const user = patientUsers[i];
    await prisma.patient.create({
      data: {
        clinicId,
        userId: user.id,
        name: user.name,
        birthDay: birthDate(i),
        address: ADDRESSES[i % ADDRESSES.length],
        zipCode: '80420-090',
      },
    });
  }

  console.log(`✅ ${patientUsers.length} pacientes criados`);
  return prisma.patient.findMany({ where: { clinicId } });
}

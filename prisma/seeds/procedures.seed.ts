import { PrismaClient } from '@prisma/client';

const PROCEDURES = [
  { name: 'Toxina Botulínica',          price: 1200, notes: 'Aplicação por área (testa, glabela, pés de galinha)' },
  { name: 'Preenchimento Labial',        price: 1800, notes: 'Ácido hialurônico — volume e definição labial' },
  { name: 'Preenchimento Malar',         price: 2200, notes: 'Ácido hialurônico — projeção e simetria malar' },
  { name: 'Bioestimulador de Colágeno',  price: 2800, notes: 'Sculptra ou Radiesse — estímulo natural de colágeno' },
  { name: 'Fio de PDO',                  price: 1600, notes: 'Fios tensores absorvíveis para lifting não cirúrgico' },
  { name: 'Skinbooster',                 price: 1400, notes: 'Hidratação profunda com ácido hialurônico não reticulado' },
  { name: 'Peeling Químico',             price: 480,  notes: 'TCA, salicílico ou glicólico conforme indicação' },
  { name: 'Microagulhamento com PRP',    price: 850,  notes: 'Microagulhamento associado ao plasma rico em plaquetas' },
  { name: 'Limpeza de Pele Profunda',    price: 390,  notes: 'Esfoliação, extração e hidratação profissional' },
  { name: 'Drenagem Linfática Facial',   price: 280,  notes: 'Técnica manual para redução de edema e toxinas' },
];

export async function seedProcedures(prisma: PrismaClient, franchiseId: string) {
  console.log('💉 Criando procedimentos...');

  const procedures = [];
  for (const p of PROCEDURES) {
    const proc = await prisma.procedure.create({
      data: {
        franchiseId,
        name: p.name,
        price: p.price,
        notes: p.notes,
        status: 'ACTIVE',
      },
    });
    procedures.push(proc);
  }

  console.log(`✅ ${procedures.length} procedimentos criados`);
  return procedures;
}

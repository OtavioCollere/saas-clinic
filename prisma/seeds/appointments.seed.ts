import { PrismaClient } from '@prisma/client';

// Slots disponíveis ao longo do dia
const SLOTS = [
  { h: 8, m: 0 },  { h: 9, m: 0 },  { h: 10, m: 0 }, { h: 11, m: 0 },
  { h: 13, m: 0 }, { h: 14, m: 0 }, { h: 15, m: 0 }, { h: 16, m: 0 }, { h: 17, m: 0 },
];

// Duração de cada procedimento em minutos (índice corresponde ao array de procedures)
const DURATIONS = [60, 60, 60, 90, 90, 60, 45, 75, 90, 60];

function dateAt(base: Date, offsetDays: number, h: number, m: number): Date {
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + offsetDays,
    h, m, 0, 0,
  );
}

type ApptDef = {
  id: string;
  dayOffset: number;
  slotIdx: number;
  procIdx: number;
  profIdx: number;
  patIdx: number;
  status: string;
};

function batch(
  prefix: string,
  count: number,
  dayStart: number,
  dayEnd: number,
  statusFn: (i: number) => string,
  patOffset: number,
): ApptDef[] {
  const range = Math.max(1, dayEnd - dayStart);
  return Array.from({ length: count }, (_, i) => ({
    id: `appt-${prefix}-${i + 1}`,
    dayOffset: dayStart + Math.round((i / count) * range),
    slotIdx: i % SLOTS.length,
    procIdx: i % 10,
    profIdx: i % 3,
    patIdx: (patOffset + i) % 50,
    status: statusFn(i),
  }));
}

const DONE = () => 'DONE';
const WAITING = () => 'WAITING';

export async function seedAppointments(
  prisma: PrismaClient,
  professionals: Array<{ id: string }>,
  franchiseId: string,
  patients: Array<{ id: string; name: string }>,
  procedures: Array<{ id: string; price: unknown; name: string }>
) {
  console.log('📅 Criando agendamentos...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const priceOf: Record<string, number> = {};
  for (const p of procedures) {
    const v = p.price as { toNumber?: () => number } | number;
    priceOf[p.id] = typeof v === 'object' && v?.toNumber ? v.toNumber() : Number(p.price);
  }

  const defs: ApptDef[] = [
    // Há ~4 meses (22 consultas — todas concluídas) — pacientes 0..21
    ...batch('q1', 22, -120, -91, DONE, 0),

    // Há ~3 meses (20 consultas — todas concluídas) — pacientes 22..41
    ...batch('q2', 20, -90, -62, DONE, 22),

    // Cobertura extra: garante que pacientes 42..49 também tenham histórico
    ...batch('cover', 16, -85, -40, DONE, 42),

    // Mês anterior (28 consultas — 25 concluídas + 3 canceladas)
    ...batch('prev', 28, -61, -32,
      (i) => (i === 4 || i === 11 || i === 19) ? 'CANCELED' : 'DONE', 10),

    // Mês atual — dias passados (20 consultas — 18 concluídas + 2 canceladas)
    ...batch('cur', 20, -31, -1,
      (i) => (i === 6 || i === 14) ? 'CANCELED' : 'DONE', 5),

    // Semana passada — para comparação do dashboard (8 consultas)
    ...batch('lw', 8, -7, -1, DONE, 15),

    // Hoje (8 consultas — mix de status)
    ...batch('today', 8, 0, 0,
      (i) => i < 2 ? 'DONE' : i < 5 ? 'CONFIRMED' : 'WAITING', 30),

    // Próxima semana (12 consultas — aguardando)
    ...batch('nw', 12, 1, 7, WAITING, 38),

    // Duas semanas à frente (8 consultas — aguardando)
    ...batch('future', 8, 8, 21, WAITING, 45),
  ];

  let created = 0;
  for (const def of defs) {
    const slot = SLOTS[def.slotIdx];
    const startAt = dateAt(today, def.dayOffset, slot.h, slot.m);
    const duration = DURATIONS[def.procIdx];
    const endAt = new Date(startAt.getTime() + duration * 60_000);

    const professionalId = professionals[def.profIdx % professionals.length].id;
    const patientId = patients[def.patIdx % patients.length].id;
    const procedure = procedures[def.procIdx % procedures.length];
    const price = priceOf[procedure.id] ?? 500;

    const appointment = await prisma.appointment.create({
      data: {
        id: def.id,
        professionalId,
        franchiseId,
        patientId,
        name: procedure.name,
        durationInMinutes: duration,
        startAt,
        endAt,
        status: def.status,
      },
    });

    await prisma.appointmentItem.create({
      data: {
        id: `item-${def.id}`,
        appointmentId: appointment.id,
        procedureId: procedure.id,
        price,
      },
    });

    created++;
  }

  console.log(`✅ ${created} agendamentos criados`);
}

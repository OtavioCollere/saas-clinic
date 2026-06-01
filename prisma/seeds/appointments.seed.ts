import { PrismaClient } from '@prisma/client';

function dateAt(base: Date, offsetDays: number, hour: number, minute = 0): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offsetDays, hour, minute, 0, 0);
  return d;
}

export async function seedAppointments(
  prisma: PrismaClient,
  professionals: Array<{ id: string }>,
  franchiseId: string,
  patients: Array<{ id: string }>,
  procedures: Array<{ id: string; price: unknown }>
) {
  console.log('📅 Seeding appointments...');

  const profIds = professionals.map((p) => p.id);
  const patIds = patients.map((p) => p.id);
  const procIds = procedures.map((p) => p.id);

  const priceOf: Record<string, number> = {};
  for (const p of procedures) {
    const v = p.price as { toNumber?: () => number } | number;
    priceOf[p.id] = typeof v === 'object' && v?.toNumber ? v.toNumber() : Number(p.price);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  type AppointmentDef = {
    id: string;
    startAt: Date;
    durationInMinutes: number;
    status: string;
    patientIdx: number;
    professionalIdx: number;
    procedureIdx: number;
  };

  const defs: AppointmentDef[] = [
    // ── Hoje (5 consultas) ──────────────────────────────────────────────
    { id: 'appt-today-1', startAt: dateAt(today, 0, 8, 0),  durationInMinutes: 30, status: 'CONFIRMED', patientIdx: 0,  professionalIdx: 0, procedureIdx: 0 },
    { id: 'appt-today-2', startAt: dateAt(today, 0, 9, 0),  durationInMinutes: 30, status: 'CONFIRMED', patientIdx: 1,  professionalIdx: 1, procedureIdx: 1 },
    { id: 'appt-today-3', startAt: dateAt(today, 0, 10, 0), durationInMinutes: 30, status: 'WAITING',   patientIdx: 2,  professionalIdx: 2, procedureIdx: 2 },
    { id: 'appt-today-4', startAt: dateAt(today, 0, 11, 0), durationInMinutes: 30, status: 'WAITING',   patientIdx: 3,  professionalIdx: 0, procedureIdx: 3 },
    { id: 'appt-today-5', startAt: dateAt(today, 0, 14, 0), durationInMinutes: 30, status: 'CONFIRMED', patientIdx: 4,  professionalIdx: 1, procedureIdx: 4 },

    // ── Mesma semana passada (3 consultas — base de comparação) ─────────
    { id: 'appt-lastweek-1', startAt: dateAt(today, -7, 8, 0),  durationInMinutes: 30, status: 'DONE', patientIdx: 5,  professionalIdx: 0, procedureIdx: 0 },
    { id: 'appt-lastweek-2', startAt: dateAt(today, -7, 9, 0),  durationInMinutes: 30, status: 'DONE', patientIdx: 6,  professionalIdx: 1, procedureIdx: 1 },
    { id: 'appt-lastweek-3', startAt: dateAt(today, -7, 10, 0), durationInMinutes: 30, status: 'DONE', patientIdx: 7,  professionalIdx: 2, procedureIdx: 2 },

    // ── Este mês — dias anteriores ao de hoje (10 consultas) ────────────
    { id: 'appt-month-1',  startAt: dateAt(today, -1,  8, 0),  durationInMinutes: 30, status: 'DONE',      patientIdx: 8,  professionalIdx: 0, procedureIdx: 0 },
    { id: 'appt-month-2',  startAt: dateAt(today, -2,  9, 0),  durationInMinutes: 30, status: 'DONE',      patientIdx: 9,  professionalIdx: 1, procedureIdx: 1 },
    { id: 'appt-month-3',  startAt: dateAt(today, -3,  10, 0), durationInMinutes: 30, status: 'DONE',      patientIdx: 10, professionalIdx: 2, procedureIdx: 2 },
    { id: 'appt-month-4',  startAt: dateAt(today, -4,  11, 0), durationInMinutes: 30, status: 'DONE',      patientIdx: 11, professionalIdx: 0, procedureIdx: 3 },
    { id: 'appt-month-5',  startAt: dateAt(today, -5,  8, 0),  durationInMinutes: 30, status: 'DONE',      patientIdx: 12, professionalIdx: 1, procedureIdx: 4 },
    { id: 'appt-month-6',  startAt: dateAt(today, -6,  9, 0),  durationInMinutes: 30, status: 'CANCELED',  patientIdx: 13, professionalIdx: 2, procedureIdx: 0 },
    { id: 'appt-month-7',  startAt: dateAt(today, -8,  10, 0), durationInMinutes: 30, status: 'DONE',      patientIdx: 14, professionalIdx: 0, procedureIdx: 1 },
    { id: 'appt-month-8',  startAt: dateAt(today, -9,  11, 0), durationInMinutes: 30, status: 'DONE',      patientIdx: 15, professionalIdx: 1, procedureIdx: 2 },
    { id: 'appt-month-9',  startAt: dateAt(today, -10, 8, 0),  durationInMinutes: 30, status: 'DONE',      patientIdx: 16, professionalIdx: 2, procedureIdx: 3 },
    { id: 'appt-month-10', startAt: dateAt(today, -11, 9, 0),  durationInMinutes: 30, status: 'DONE',      patientIdx: 17, professionalIdx: 0, procedureIdx: 4 },

    // ── Mês passado (8 consultas — base de comparação de receita) ───────
    { id: 'appt-lastmonth-1', startAt: dateAt(today, -32, 8, 0),  durationInMinutes: 30, status: 'DONE', patientIdx: 18, professionalIdx: 0, procedureIdx: 0 },
    { id: 'appt-lastmonth-2', startAt: dateAt(today, -33, 9, 0),  durationInMinutes: 30, status: 'DONE', patientIdx: 19, professionalIdx: 1, procedureIdx: 1 },
    { id: 'appt-lastmonth-3', startAt: dateAt(today, -34, 10, 0), durationInMinutes: 30, status: 'DONE', patientIdx: 20, professionalIdx: 2, procedureIdx: 2 },
    { id: 'appt-lastmonth-4', startAt: dateAt(today, -35, 11, 0), durationInMinutes: 30, status: 'DONE', patientIdx: 21, professionalIdx: 0, procedureIdx: 3 },
    { id: 'appt-lastmonth-5', startAt: dateAt(today, -36, 8, 0),  durationInMinutes: 30, status: 'DONE', patientIdx: 22, professionalIdx: 1, procedureIdx: 4 },
    { id: 'appt-lastmonth-6', startAt: dateAt(today, -37, 9, 0),  durationInMinutes: 30, status: 'DONE', patientIdx: 23, professionalIdx: 2, procedureIdx: 0 },
    { id: 'appt-lastmonth-7', startAt: dateAt(today, -38, 10, 0), durationInMinutes: 30, status: 'DONE', patientIdx: 24, professionalIdx: 0, procedureIdx: 1 },
    { id: 'appt-lastmonth-8', startAt: dateAt(today, -39, 11, 0), durationInMinutes: 30, status: 'DONE', patientIdx: 25, professionalIdx: 1, procedureIdx: 2 },
  ];

  for (const def of defs) {
    const endAt = new Date(def.startAt.getTime() + def.durationInMinutes * 60_000);
    const professionalId = profIds[def.professionalIdx % profIds.length];
    const patientId = patIds[def.patientIdx % patIds.length];
    const procedureId = procIds[def.procedureIdx % procIds.length];
    const price = priceOf[procedureId] ?? 350;

    const appointment = await prisma.appointment.upsert({
      where: { id: def.id },
      update: { startAt: def.startAt, endAt, status: def.status },
      create: {
        id: def.id,
        professionalId,
        franchiseId,
        patientId,
        name: `Consulta ${def.id}`,
        durationInMinutes: def.durationInMinutes,
        startAt: def.startAt,
        endAt,
        status: def.status,
      },
    });

    await prisma.appointmentItem.upsert({
      where: { id: `item-${def.id}` },
      update: { price },
      create: {
        id: `item-${def.id}`,
        appointmentId: appointment.id,
        procedureId,
        price,
        notes: null,
      },
    });
  }

  console.log(`✅ Created/updated ${defs.length} appointments with items`);
}

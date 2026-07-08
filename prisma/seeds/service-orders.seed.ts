import { PrismaClient } from '@prisma/client';

const PAYMENT_METHODS = [
  'pix', 'pix', 'pix',
  'credit_card', 'credit_card',
  'cash',
  'debit_card',
  'pix',
];

export async function seedServiceOrders(
  prisma: PrismaClient,
  franchiseId: string,
) {
  console.log('🧾 Criando comandas (service orders)...');

  const appointments = await prisma.appointment.findMany({
    where: { franchiseId },
    include: { appointmentItems: true },
    orderBy: { startAt: 'asc' },
  });

  const now = new Date();
  let created = 0;

  for (let i = 0; i < appointments.length; i++) {
    const appt = appointments[i];

    // Só cria comanda para consultas passadas ou canceladas
    const isPast = appt.startAt <= now;
    if (!isPast && appt.status !== 'CANCELED') continue;

    const method = PAYMENT_METHODS[i % PAYMENT_METHODS.length];
    let status: string;
    let paidAt: Date | null = null;

    if (appt.status === 'CANCELED') {
      status = 'CANCELED';
    } else if (appt.status === 'DONE') {
      if (i % 12 === 5) {
        // ~8% ficaram em WAITING_PAYMENT (paciente não pagou na hora)
        status = 'WAITING_PAYMENT';
      } else if (i % 20 === 3) {
        // ~5% ficaram como PENDING (consultou mas ainda não fechou comanda)
        status = 'PENDING';
      } else {
        status = 'PAID';
        paidAt = new Date(appt.endAt.getTime() + (10 + (i % 25)) * 60_000);
      }
    } else if (appt.status === 'CONFIRMED') {
      status = 'PENDING';
    } else {
      // WAITING — ainda não aconteceu
      status = 'PENDING';
    }

    await prisma.serviceOrder.create({
      data: {
        id: `so-${appt.id}`,
        status,
        paymentMethod: method,
        paidAt,
        franchiseId,
        appointmentId: appt.id,
        items: {
          create: appt.appointmentItems.map((item) => ({
            id: `soi-${item.id}`,
            appointmentItemId: item.id,
            procedureId: item.procedureId,
            price: item.price,
          })),
        },
      },
    });

    created++;
  }

  console.log(`✅ ${created} comandas criadas`);
}

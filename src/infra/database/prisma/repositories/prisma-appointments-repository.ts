import { Inject, Injectable } from "@nestjs/common";
import { AppointmentsRepository } from "@/domain/application/repositories/appointments-repository";
import { Appointment } from "@/domain/enterprise/entities/appointment";
import { AppointmentItem } from "@/domain/enterprise/entities/appointment-item";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { PrismaService } from "../../prisma.service";
import { AppointmentMapper } from "../mappers/appointment-mapper";

@Injectable()
export class PrismaAppointmentsRepository extends AppointmentsRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(appointment: Appointment): Promise<Appointment> {
    const data = AppointmentMapper.toPrisma(appointment);
    const raw = await this.prisma.appointment.create({
      data,
      include: {
        appointmentItems: true,
      },
    });
    return AppointmentMapper.toDomain(raw);
  }

  async findByAppointmentItemIds(ids: string[]): Promise<AppointmentItem[]> {
    if (ids.length === 0) return [];

    const raw = await this.prisma.appointmentItem.findMany({
      where: { id: { in: ids } },
    });

    return raw.map((item) => {
      const price = Number(item.price);
      return AppointmentItem.create(
        {
          procedureId: new UniqueEntityId(item.procedureId),
          price,
          notes: item.notes ?? undefined,
        },
        new UniqueEntityId(item.id)
      );
    });
  }

  async findById(id: string): Promise<Appointment | null> {
    const raw = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        appointmentItems: true,
      },
    });
    if (!raw) return null;
    return AppointmentMapper.toDomain(raw);
  }

  async findByProfessionalId(professionalId: string, options?: { period?: 'active' | 'history' }): Promise<Appointment[]> {
    const now = new Date();
    const where: Record<string, unknown> = { professionalId };
    if (options?.period === 'active') {
      where.endAt = { gte: now };
    } else if (options?.period === 'history') {
      where.endAt = { lt: now };
    }
    const raw = await this.prisma.appointment.findMany({
      where,
      include: {
        appointmentItems: true,
      },
      orderBy: { startAt: 'desc' },
    });
    return raw.map(AppointmentMapper.toDomain);
  }

  async findByPatientId(patientId: string, options?: { period?: 'active' | 'history' }): Promise<Appointment[]> {
    const now = new Date();
    const where: Record<string, unknown> = { patientId };
    if (options?.period === 'active') {
      where.endAt = { gte: now };
    } else if (options?.period === 'history') {
      where.endAt = { lt: now };
    }
    const raw = await this.prisma.appointment.findMany({
      where,
      include: {
        appointmentItems: true,
      },
      orderBy: { startAt: 'desc' },
    });
    return raw.map(AppointmentMapper.toDomain);
  }

  async findByProfessionalIdAndHourRange(
    professionalId: string,
    startAt: Date,
    endAt: Date
  ): Promise<Appointment | null> {
    // Overlap: existing.startAt < new.endAt AND existing.endAt > new.startAt
    // Permite agendamentos encostados (ex.: 15:30-16:00 e 16:00-17:00)
    const raw = await this.prisma.appointment.findFirst({
      where: {
        professionalId,
        AND: [
          {
            startAt: {
              lt: endAt,
            },
          },
          {
            endAt: {
              gt: startAt,
            },
          },
        ],
      },
      include: {
        appointmentItems: true,
      },
    });
    if (!raw) return null;
    return AppointmentMapper.toDomain(raw);
  }

  async findByProfessionalIdAndHourRangeExcludingId(
    professionalId: string,
    startAt: Date,
    endAt: Date,
    excludeId: string
  ): Promise<Appointment | null> {
    const raw = await this.prisma.appointment.findFirst({
      where: {
        professionalId,
        id: {
          not: excludeId,
        },
        AND: [
          {
            startAt: {
              lt: endAt,
            },
          },
          {
            endAt: {
              gt: startAt,
            },
          },
        ],
      },
      include: {
        appointmentItems: true,
      },
    });
    if (!raw) return null;
    return AppointmentMapper.toDomain(raw);
  }

  async findPendingByClinicId(clinicId: string): Promise<Appointment[]> {
    // Busca todas as franquias da clínica
    const franchises = await this.prisma.franchise.findMany({
      where: { clinicId },
      select: { id: true },
    });

    const franchiseIds = franchises.map(f => f.id);

    if (franchiseIds.length === 0) {
      return [];
    }

    const raw = await this.prisma.appointment.findMany({
      where: {
        franchiseId: {
          in: franchiseIds,
        },
        status: 'WAITING',
      },
      include: {
        appointmentItems: true,
      },
      orderBy: { startAt: 'desc' },
    });

    return raw.map(AppointmentMapper.toDomain);
  }

  async findPendingByFranchiseId(franchiseId: string): Promise<Appointment[]> {
    const raw = await this.prisma.appointment.findMany({
      where: {
        franchiseId,
        status: 'WAITING',
      },
      include: {
        appointmentItems: true,
      },
      orderBy: { startAt: 'desc' },
    });
    return raw.map(AppointmentMapper.toDomain);
  }

  async findByClinicId(clinicId: string): Promise<Appointment[]> {
    // Busca todas as franquias da clínica
    const franchises = await this.prisma.franchise.findMany({
      where: { clinicId },
      select: { id: true },
    });

    const franchiseIds = franchises.map(f => f.id);

    if (franchiseIds.length === 0) {
      return [];
    }

    const raw = await this.prisma.appointment.findMany({
      where: {
        franchiseId: {
          in: franchiseIds,
        },
      },
      include: {
        appointmentItems: true,
      },
      orderBy: { startAt: 'desc' },
    });

    return raw.map(AppointmentMapper.toDomain);
  }

  async findFutureByClinicId(clinicId: string): Promise<Appointment[]> {
    const franchises = await this.prisma.franchise.findMany({
      where: { clinicId },
      select: { id: true },
    });

    const franchiseIds = franchises.map(f => f.id);
    if (franchiseIds.length === 0) return [];

    const now = new Date();
    const raw = await this.prisma.appointment.findMany({
      where: {
        franchiseId: { in: franchiseIds },
        endAt: { gte: now },
      },
      include: { appointmentItems: true },
      orderBy: { startAt: 'asc' },
    });
    return raw.map(AppointmentMapper.toDomain);
  }

  async findHistoryByClinicIdPaginated(
    clinicId: string,
    page: number,
    perPage: number
  ): Promise<{ appointments: Appointment[]; total: number }> {
    const franchises = await this.prisma.franchise.findMany({
      where: { clinicId },
      select: { id: true },
    });

    const franchiseIds = franchises.map(f => f.id);
    if (franchiseIds.length === 0) return { appointments: [], total: 0 };

    const now = new Date();
    const where = {
      franchiseId: { in: franchiseIds },
      endAt: { lt: now },
    };

    const [raw, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        include: { appointmentItems: true },
        orderBy: { startAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      appointments: raw.map(AppointmentMapper.toDomain),
      total,
    };
  }

  async findByClinicIdAndWeek(clinicId: string, weekStart: Date, weekEnd: Date): Promise<Appointment[]> {
    // Busca todas as franquias da clínica
    const franchises = await this.prisma.franchise.findMany({
      where: { clinicId },
      select: { id: true },
    });

    const franchiseIds = franchises.map(f => f.id);

    if (franchiseIds.length === 0) {
      return [];
    }

    const raw = await this.prisma.appointment.findMany({
      where: {
        franchiseId: {
          in: franchiseIds,
        },
        startAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        appointmentItems: true,
      },
      orderBy: { startAt: 'asc' },
    });

    return raw.map(AppointmentMapper.toDomain);
  }

  async update(appointment: Appointment): Promise<Appointment> {
    const data = AppointmentMapper.toPrismaUpdate(appointment);
    
    // Primeiro atualiza o appointment
    await this.prisma.appointment.update({
      where: { id: appointment.id.toString() },
      data,
    });

    // Depois busca novamente com os items
    const raw = await this.prisma.appointment.findUnique({
      where: { id: appointment.id.toString() },
      include: {
        appointmentItems: true,
      },
    });

    if (!raw) {
      throw new Error('Appointment not found after update');
    }

    return AppointmentMapper.toDomain(raw);
  }

  async countByClinicIdAndDateRange(clinicId: string, start: Date, end: Date): Promise<number> {
    return this.prisma.appointment.count({
      where: {
        franchise: { clinicId },
        startAt: { gte: start, lt: end },
      },
    });
  }

  async sumItemsPriceByClinicIdAndDateRange(clinicId: string, start: Date, end: Date): Promise<number> {
    const result = await this.prisma.appointmentItem.aggregate({
      _sum: { price: true },
      where: {
        appointment: {
          franchise: { clinicId },
          startAt: { gte: start, lt: end },
          status: 'DONE',
        },
      },
    });
    return result._sum.price?.toNumber() ?? 0;
  }

  async markAsDone(appointmentId: string): Promise<void> {
    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'DONE' },
    });
  }

  async findActiveForDate(date: Date): Promise<Appointment[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const raw = await this.prisma.appointment.findMany({
      where: {
        startAt: { gte: start, lte: end },
        status: { in: ['WAITING', 'CONFIRMED'] },
      },
      include: { appointmentItems: true },
      orderBy: { startAt: 'asc' },
    });

    return raw.map(AppointmentMapper.toDomain);
  }
}



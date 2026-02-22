import { Inject, Injectable } from "@nestjs/common";
import { AppointmentsRepository } from "@/domain/application/repositories/appointments-repository";
import { Appointment } from "@/domain/enterprise/entities/appointment";
import { PrismaService } from "../../prisma.service";
import { AppointmentMapper } from "../mappers/appointment-mapper";
import type { Prisma } from "@prisma/client";

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

  async findByProfessionalId(professionalId: string): Promise<Appointment[]> {
    const raw = await this.prisma.appointment.findMany({
      where: { professionalId },
      include: {
        appointmentItems: true,
      },
      orderBy: { startAt: 'desc' },
    });
    return raw.map(AppointmentMapper.toDomain);
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    const raw = await this.prisma.appointment.findMany({
      where: { patientId },
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
    const raw = await this.prisma.appointment.findFirst({
      where: {
        professionalId,
        AND: [
          {
            startAt: {
              lte: endAt,
            },
          },
          {
            endAt: {
              gte: startAt,
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
              lte: endAt,
            },
          },
          {
            endAt: {
              gte: startAt,
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
}



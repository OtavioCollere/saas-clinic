import { Appointment } from "@/domain/enterprise/entities/appointment";
import { AppointmentItem } from "@/domain/enterprise/entities/appointment-item";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { AppointmentStatus } from "@/domain/enterprise/value-objects/appointment-status";

type AppointmentRaw = {
  id: string;
  professionalId: string;
  franchiseId: string;
  patientId: string;
  name: string;
  durationInMinutes: number;
  startAt: Date;
  endAt: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
  appointmentItems: Array<{
    id: string;
    procedureId: string;
    price: number | string;
    notes: string | null;
  }>;
};

type AppointmentPrismaCreateInput = {
  id: string;
  professional: {
    connect: {
      id: string;
    };
  };
  franchise: {
    connect: {
      id: string;
    };
  };
  patient: {
    connect: {
      id: string;
    };
  };
  name: string;
  durationInMinutes: number;
  startAt: Date;
  endAt: Date;
  status: string;
  createdAt: Date;
  appointmentItems: {
    create: Array<{
      id: string;
      procedure: {
        connect: {
          id: string;
        };
      };
      price: number | string;
      notes?: string | null;
    }>;
  };
};

type AppointmentPrismaUpdateInput = {
  professionalId?: string;
  franchiseId?: string;
  patientId?: string;
  name?: string;
  durationInMinutes?: number;
  startAt?: Date;
  endAt?: Date;
  status?: string;
  updatedAt?: Date;
};

export class AppointmentMapper {
  static toDomain(raw: AppointmentRaw): Appointment {
    const status = AppointmentStatus.fromValue(raw.status);

    const appointmentItems = raw.appointmentItems.map((item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price) 
        : item.price;

      return AppointmentItem.create(
        {
          procedureId: new UniqueEntityId(item.procedureId),
          price,
          notes: item.notes ?? undefined,
        },
        new UniqueEntityId(item.id)
      );
    });

    return Appointment.create(
      {
        professionalId: new UniqueEntityId(raw.professionalId),
        franchiseId: new UniqueEntityId(raw.franchiseId),
        patientId: new UniqueEntityId(raw.patientId),
        name: raw.name,
        durationInMinutes: raw.durationInMinutes,
        appointmentItems,
        startAt: raw.startAt,
        endAt: raw.endAt,
        status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(appointment: Appointment): AppointmentPrismaCreateInput {
    return {
      id: appointment.id.toString(),
      professional: {
        connect: {
          id: appointment.professionalId.toString(),
        },
      },
      franchise: {
        connect: {
          id: appointment.franchiseId.toString(),
        },
      },
      patient: {
        connect: {
          id: appointment.patientId.toString(),
        },
      },
      name: appointment.name,
      durationInMinutes: appointment.durationInMinutes,
      startAt: appointment.startAt,
      endAt: appointment.endAt,
      status: appointment.status.getValue(),
      createdAt: appointment.createdAt,
      appointmentItems: {
        create: appointment.appointmentItems.map((item) => ({
          id: item.id.toString(),
          procedure: {
            connect: {
              id: item.procedureId.toString(),
            },
          },
          price: item.price,
          notes: item.notes ?? null,
        })),
      },
    };
  }

  static toPrismaUpdate(appointment: Appointment): AppointmentPrismaUpdateInput {
    return {
      professionalId: appointment.professionalId.toString(),
      franchiseId: appointment.franchiseId.toString(),
      patientId: appointment.patientId.toString(),
      name: appointment.name,
      durationInMinutes: appointment.durationInMinutes,
      startAt: appointment.startAt,
      endAt: appointment.endAt,
      status: appointment.status.getValue(),
      updatedAt: new Date(),
    };
  }
}




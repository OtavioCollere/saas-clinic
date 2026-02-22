import { Patient } from "@/domain/enterprise/entities/patient";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

type PatientRaw = {
  id: string;
  clinicId: string;
  userId: string;
  name: string;
  birthDay: Date;
  address: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date | null;
};

type PatientPrismaCreateInput = {
  id: string;
  clinic: {
    connect: {
      id: string;
    };
  };
  user: {
    connect: {
      id: string;
    };
  };
  name: string;
  birthDay: Date;
  address: string;
  zipCode: string;
  createdAt: Date;
  // updatedAt não é incluído na criação - Prisma gerencia automaticamente com @updatedAt
};

type PatientPrismaUpdateInput = {
  name?: string;
  birthDay?: Date;
  address?: string;
  zipCode?: string;
  // updatedAt não é incluído - Prisma gerencia automaticamente com @updatedAt
};

export class PatientMapper {
  static toDomain(raw: PatientRaw): Patient {
    return Patient.create(
      {
        clinicId: new UniqueEntityId(raw.clinicId),
        userId: new UniqueEntityId(raw.userId),
        name: raw.name,
        birthDay: raw.birthDay,
        address: raw.address,
        zipCode: raw.zipCode,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(patient: Patient): PatientPrismaCreateInput {
    return {
      id: patient.id.toString(),
      clinic: {
        connect: {
          id: patient.clinicId.toString(),
        },
      },
      user: {
        connect: {
          id: patient.userId.toString(),
        },
      },
      name: patient.name,
      birthDay: patient.birthDay,
      address: patient.address,
      zipCode: patient.zipCode,
      createdAt: patient.createdAt,
      // updatedAt não é incluído - Prisma gerencia automaticamente com @updatedAt
    };
  }

  static toPrismaUpdate(patient: Patient): PatientPrismaUpdateInput {
    return {
      name: patient.name,
      birthDay: patient.birthDay,
      address: patient.address,
      zipCode: patient.zipCode,
      // updatedAt não é incluído - Prisma gerencia automaticamente com @updatedAt
    };
  }
}



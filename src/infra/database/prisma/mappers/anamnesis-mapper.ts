import { Anamnesis } from "@/domain/enterprise/entities/anamnesis/anamnesis";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import type { Prisma } from "@prisma/client";

type AnamnesisRaw = {
  id: string;
  patientId: string;
  aestheticHistory: Prisma.JsonValue;
  healthConditions: Prisma.JsonValue;
  medicalHistory: Prisma.JsonValue;
  physicalAssessment: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date | null;
};

type AnamnesisPrismaCreateInput = {
  id: string;
  patient: {
    connect: {
      id: string;
    };
  };
  aestheticHistory: Prisma.JsonValue;
  healthConditions: Prisma.JsonValue;
  medicalHistory: Prisma.JsonValue;
  physicalAssessment: Prisma.JsonValue;
  createdAt: Date;
  // updatedAt não é incluído na criação - Prisma gerencia automaticamente com @updatedAt
};

type AnamnesisPrismaUpdateInput = {
  aestheticHistory?: Prisma.JsonValue;
  healthConditions?: Prisma.JsonValue;
  medicalHistory?: Prisma.JsonValue;
  physicalAssessment?: Prisma.JsonValue;
  // updatedAt não é incluído - Prisma gerencia automaticamente com @updatedAt
};

export class AnamnesisMapper {
  static toDomain(raw: AnamnesisRaw): Anamnesis {
    return Anamnesis.create(
      {
        patientId: new UniqueEntityId(raw.patientId),
        aestheticHistory: raw.aestheticHistory as any,
        healthConditions: raw.healthConditions as any,
        medicalHistory: raw.medicalHistory as any,
        physicalAssessment: raw.physicalAssessment as any,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(anamnesis: Anamnesis): AnamnesisPrismaCreateInput {
    return {
      id: anamnesis.id.toString(),
      patient: {
        connect: {
          id: anamnesis.patientId.toString(),
        },
      },
      aestheticHistory: anamnesis.aestheticHistory as Prisma.JsonValue,
      healthConditions: anamnesis.healthConditions as Prisma.JsonValue,
      medicalHistory: anamnesis.medicalHistory as Prisma.JsonValue,
      physicalAssessment: anamnesis.physicalAssessment as Prisma.JsonValue,
      createdAt: anamnesis.createdAt,
      // updatedAt não é incluído - Prisma gerencia automaticamente com @updatedAt
    };
  }

  static toPrismaUpdate(anamnesis: Anamnesis): AnamnesisPrismaUpdateInput {
    return {
      aestheticHistory: anamnesis.aestheticHistory as Prisma.JsonValue,
      healthConditions: anamnesis.healthConditions as Prisma.JsonValue,
      medicalHistory: anamnesis.medicalHistory as Prisma.JsonValue,
      physicalAssessment: anamnesis.physicalAssessment as Prisma.JsonValue,
      // updatedAt não é incluído - Prisma gerencia automaticamente com @updatedAt
    };
  }
}



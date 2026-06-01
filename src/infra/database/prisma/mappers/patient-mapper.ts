import { Patient } from "@/domain/enterprise/entities/patient";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { AnamnesisMapper } from "./anamnesis-mapper";
import type { Anamnesis as PrismaAnamnesis } from "@prisma/client";

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

type PatientRawWithAnamnesis = PatientRaw & {
  anamnesis?: PrismaAnamnesis | null;
};

export class PatientMapper {
  static toDomain(raw: PatientRaw | PatientRawWithAnamnesis): Patient {
    const anamnesisRaw = "anamnesis" in raw ? raw.anamnesis : undefined;
    const anamnesis =
      anamnesisRaw != null ? AnamnesisMapper.toDomain(anamnesisRaw) : undefined;

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
        ...(anamnesis != null && { anamnesis }),
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(patient: Patient) {
    return {
      id: patient.id.toString(),
      clinicId: patient.clinicId.toString(),
      userId: patient.userId.toString(),
      name: patient.name,
      birthDay: patient.birthDay,
      address: patient.address,
      zipCode: patient.zipCode,
    };
  }
}

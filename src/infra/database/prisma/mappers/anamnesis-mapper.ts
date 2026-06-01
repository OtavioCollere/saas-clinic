import { Anamnesis } from '@/domain/enterprise/entities/anamnesis/anamnesis'
import { UniqueEntityId } from '@/shared/entities/unique-entity-id'
import type { AestheticHistory } from '@/domain/enterprise/entities/anamnesis/aesthetic-history'
import type { HealthConditions } from '@/domain/enterprise/entities/anamnesis/health-conditions'
import type { MedicalHistory } from '@/domain/enterprise/entities/anamnesis/medical-history'
import type { PhysicalAssessment } from '@/domain/enterprise/entities/anamnesis/physical-assessment'
import type { Anamnesis as PrismaAnamnesis } from '@prisma/client'

type AnamnesisRaw = PrismaAnamnesis

export class AnamnesisMapper {
  static toDomain(raw: AnamnesisRaw): Anamnesis {
    return Anamnesis.create(
      {
        patientId: new UniqueEntityId(raw.patientId),
        aestheticHistory: raw.aestheticHistory as unknown as AestheticHistory,
        healthConditions: raw.healthConditions as unknown as HealthConditions,
        medicalHistory: raw.medicalHistory as unknown as MedicalHistory,
        physicalAssessment: raw.physicalAssessment as unknown as PhysicalAssessment,
        patientSignature: raw.patientSignature ?? '',
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(anamnesis: Anamnesis) {
    return {
      id: anamnesis.id.toString(),
      patientId: anamnesis.patientId.toString(),
      aestheticHistory: anamnesis.aestheticHistory,
      healthConditions: anamnesis.healthConditions,
      medicalHistory: anamnesis.medicalHistory,
      physicalAssessment: anamnesis.physicalAssessment,
      patientSignature: anamnesis.patientSignature,
      signedAt: anamnesis.patientSignature ? new Date() : null,
    }
  }
}

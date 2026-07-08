import type { AnamnesisToken } from '@/domain/enterprise/entities/anamnesis-token'

export abstract class AnamnesisTokenRepository {
  abstract create(token: AnamnesisToken): Promise<void>
  abstract findByToken(token: string): Promise<AnamnesisToken | null>
  abstract findPendingByPatientId(patientId: string): Promise<AnamnesisToken | null>
  abstract invalidateAllPendingForPatient(patientId: string): Promise<void>
  abstract markAsUsed(tokenId: string, usedAt: Date): Promise<void>
}

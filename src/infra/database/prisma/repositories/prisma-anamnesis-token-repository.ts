import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { AnamnesisTokenRepository } from '@/domain/application/repositories/anamnesis-token-repository'
import { AnamnesisToken, type AnamnesisTokenStatus } from '@/domain/enterprise/entities/anamnesis-token'
import { UniqueEntityId } from '@/shared/entities/unique-entity-id'
import type { AnamnesisToken as PrismaAnamnesisToken } from '@prisma/client'

@Injectable()
export class PrismaAnamnesisTokenRepository implements AnamnesisTokenRepository {
  constructor(private prisma: PrismaService) {}

  private toDomain(raw: PrismaAnamnesisToken): AnamnesisToken {
    return AnamnesisToken.create(
      {
        patientId: new UniqueEntityId(raw.patientId),
        clinicId: new UniqueEntityId(raw.clinicId),
        token: raw.token,
        status: raw.status as AnamnesisTokenStatus,
        expiresAt: raw.expiresAt,
        usedAt: raw.usedAt ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  async create(token: AnamnesisToken): Promise<void> {
    await this.prisma.anamnesisToken.create({
      data: {
        id: token.id.toString(),
        patientId: token.patientId.toString(),
        clinicId: token.clinicId.toString(),
        token: token.token,
        status: token.status,
        expiresAt: token.expiresAt,
        usedAt: token.usedAt ?? null,
      },
    })
  }

  async findByToken(token: string): Promise<AnamnesisToken | null> {
    const raw = await this.prisma.anamnesisToken.findUnique({ where: { token } })
    if (!raw) return null
    return this.toDomain(raw)
  }

  async findPendingByPatientId(patientId: string): Promise<AnamnesisToken | null> {
    const raw = await this.prisma.anamnesisToken.findFirst({
      where: { patientId, status: 'PENDING' },
    })
    if (!raw) return null
    return this.toDomain(raw)
  }

  async invalidateAllPendingForPatient(patientId: string): Promise<void> {
    await this.prisma.anamnesisToken.updateMany({
      where: { patientId, status: 'PENDING' },
      data: { status: 'INVALIDATED' },
    })
  }

  async markAsUsed(tokenId: string, usedAt: Date): Promise<void> {
    await this.prisma.anamnesisToken.update({
      where: { id: tokenId },
      data: { status: 'USED', usedAt },
    })
  }
}

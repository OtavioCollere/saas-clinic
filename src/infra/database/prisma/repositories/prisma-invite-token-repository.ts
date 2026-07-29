import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { InviteTokenRepository } from '@/domain/application/repositories/invite-token-repository'
import { InviteToken, type InviteTokenStatus } from '@/domain/enterprise/entities/invite-token'
import { UniqueEntityId } from '@/shared/entities/unique-entity-id'
import type { InviteToken as PrismaInviteToken } from '@prisma/client'

@Injectable()
export class PrismaInviteTokenRepository implements InviteTokenRepository {
  constructor(private prisma: PrismaService) {}

  private toDomain(raw: PrismaInviteToken): InviteToken {
    return InviteToken.create(
      {
        token: raw.token,
        createdById: new UniqueEntityId(raw.createdById),
        usedById: raw.usedById ? new UniqueEntityId(raw.usedById) : undefined,
        status: raw.status as InviteTokenStatus,
        expiresAt: raw.expiresAt,
        usedAt: raw.usedAt ?? undefined,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  async create(token: InviteToken): Promise<void> {
    await this.prisma.inviteToken.create({
      data: {
        id: token.id.toString(),
        token: token.token,
        createdById: token.createdById.toString(),
        status: token.status,
        expiresAt: token.expiresAt,
      },
    })
  }

  async findByToken(token: string): Promise<InviteToken | null> {
    const raw = await this.prisma.inviteToken.findUnique({ where: { token } })
    return raw ? this.toDomain(raw) : null
  }

  async findById(id: string): Promise<InviteToken | null> {
    const raw = await this.prisma.inviteToken.findUnique({ where: { id } })
    return raw ? this.toDomain(raw) : null
  }

  async listAll(): Promise<InviteToken[]> {
    const raws = await this.prisma.inviteToken.findMany({ orderBy: { createdAt: 'desc' } })
    return raws.map((r) => this.toDomain(r))
  }

  async save(token: InviteToken): Promise<void> {
    await this.prisma.inviteToken.update({
      where: { id: token.id.toString() },
      data: {
        status: token.status,
        usedById: token.usedById?.toString() ?? null,
        usedAt: token.usedAt ?? null,
      },
    })
  }
}

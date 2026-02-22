import { Inject, Injectable } from "@nestjs/common";
import { PasswordVerificationRepository } from "@/domain/application/repositories/password-verification-repository";
import { PasswordVerification } from "@/domain/enterprise/entities/password-verification";
import { PrismaService } from "../../prisma.service";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";

@Injectable()
export class PrismaPasswordVerificationRepository extends PasswordVerificationRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(passwordVerification: PasswordVerification): Promise<void> {
    if (!this.prisma) {
      throw new Error('PrismaService não foi injetado corretamente. this.prisma está undefined.');
    }
    
    if (!this.prisma.passwordVerification) {
      throw new Error('PrismaService não possui a propriedade passwordVerification. Verifique o schema do Prisma.');
    }

    await this.prisma.passwordVerification.create({
      data: {
        id: passwordVerification.id.toString(),
        userId: passwordVerification.userId.toString(),
        token: passwordVerification.token,
        expiresAt: passwordVerification.expiresAt ?? new Date(Date.now() + 60 * 60 * 1000),
        usedAt: passwordVerification.usedAt,
        createdAt: passwordVerification.createdAt,
        updatedAt: passwordVerification.updatedAt,
      },
    });
  }

  async update(passwordVerification: PasswordVerification): Promise<void> {
    await this.prisma.passwordVerification.update({
      where: { id: passwordVerification.id.toString() },
      data: {
        usedAt: passwordVerification.usedAt,
        updatedAt: passwordVerification.updatedAt ?? new Date(),
      },
    });
  }

  async findByToken(token: string): Promise<PasswordVerification | null> {
    const raw = await this.prisma.passwordVerification.findUnique({
      where: { token },
    });

    if (!raw) return null;

    return this.toDomain(raw);
  }

  async findByUserId(userId: UniqueEntityId): Promise<PasswordVerification | null> {
    const raw = await this.prisma.passwordVerification.findFirst({
      where: { userId: userId.toString() },
      orderBy: { createdAt: 'desc' },
    });

    if (!raw) return null;

    return this.toDomain(raw);
  }

  async delete(passwordVerification: PasswordVerification): Promise<void> {
    await this.prisma.passwordVerification.delete({
      where: { id: passwordVerification.id.toString() },
    });
  }

  private toDomain(raw: any): PasswordVerification {
    return PasswordVerification.create(
      {
        userId: new UniqueEntityId(raw.userId),
        token: raw.token,
        expiresAt: raw.expiresAt ? new Date(raw.expiresAt) : null,
        usedAt: raw.usedAt ? new Date(raw.usedAt) : null,
        createdAt: raw.createdAt ? new Date(raw.createdAt) : undefined,
        updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : undefined,
      },
      new UniqueEntityId(raw.id)
    );
  }
}


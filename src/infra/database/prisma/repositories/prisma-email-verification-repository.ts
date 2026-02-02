import { Inject, Injectable } from "@nestjs/common";
import { EmailVerificationRepository } from "@/domain/application/repositories/email-verification-repository";
import { EmailVerification } from "@/domain/enterprise/entities/email-verification";
import { PrismaService } from "../../prisma.service";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { Email } from "@/domain/enterprise/value-objects/email";

@Injectable()
export class PrismaEmailVerificationRepository extends EmailVerificationRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(
    emailVerification: EmailVerification,
    tx?: unknown,
  ): Promise<EmailVerification> {
    const prisma = (tx as any) || this.prisma;
    
    const raw = await prisma.emailVerification.create({
      data: {
        id: emailVerification.id.toString(),
        userId: emailVerification.userId.toString(),
        email: emailVerification.email.getValue(),
        token: emailVerification.token,
        expiresAt: emailVerification.expiresAt,
        verifiedAt: emailVerification.verifiedAt,
        createdAt: emailVerification.createdAt,
      },
    });

    return this.toDomain(raw);
  }

  async transaction<T>(
    fn: (tx: unknown) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return fn(tx);
    });
  }

  async deleteAllByUserId(userId: string, tx?: unknown): Promise<void> {
    const prisma = (tx as any) || this.prisma;
    
    await prisma.emailVerification.deleteMany({
      where: { userId },
    });
  }

  async findByToken(token: string): Promise<EmailVerification | null> {
    const raw = await this.prisma.emailVerification.findUnique({
      where: { token },
    });

    if (!raw) return null;

    return this.toDomain(raw);
  }

  async save(
    emailVerification: EmailVerification,
    tx?: unknown,
  ): Promise<EmailVerification> {
    const prisma = (tx as any) || this.prisma;
    
    // Verifica se existe antes de atualizar
    const existing = await prisma.emailVerification.findUnique({
      where: { id: emailVerification.id.toString() },
    });

    if (!existing) {
      // Se não existe, cria
      return this.create(emailVerification, tx);
    }

    // Se existe, atualiza
    const raw = await prisma.emailVerification.update({
      where: { id: emailVerification.id.toString() },
      data: {
        verifiedAt: emailVerification.verifiedAt,
      },
    });

    return this.toDomain(raw);
  }

  private toDomain(raw: any): EmailVerification {
    return EmailVerification.create(
      {
        userId: new UniqueEntityId(raw.userId),
        email: Email.create(raw.email),
        token: raw.token,
        expiresAt: raw.expiresAt,
        verifiedAt: raw.verifiedAt ?? undefined,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id)
    );
  }
}


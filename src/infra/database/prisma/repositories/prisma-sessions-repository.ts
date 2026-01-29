import { Inject, Injectable } from "@nestjs/common";
import { SessionsRepository } from "@/domain/application/repositories/sessions-repository";
import { Session } from "@/domain/enterprise/entities/session";
import { PrismaService } from "../../prisma.service";
import { SessionMapper } from "../mappers/session-mapper";
import { SessionStatus } from "@/domain/enterprise/value-objects/session-status";

@Injectable()
export class PrismaSessionsRepository extends SessionsRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(session: Session): Promise<Session> {
    const data = SessionMapper.toPrisma(session);

    const raw = await this.prisma.session.create({
      data,
    });

    return SessionMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Session | null> {
    const raw = await this.prisma.session.findUnique({
      where: { id },
    });

    if (!raw) return null;

    return SessionMapper.toDomain(raw);
  }

  async findActiveByUserId(userId: string): Promise<Session[]> {
    const raws = await this.prisma.session.findMany({
      where: {
        userId,
        status: SessionStatus.ACTIVE,
      },
    });

    return raws.map(SessionMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const raws = await this.prisma.session.findMany({
      where: { userId },
    });

    return raws.map(SessionMapper.toDomain);
  }

  async update(session: Session): Promise<Session> {
    const data = SessionMapper.toPrisma(session);

    const raw = await this.prisma.session.update({
      where: { id: session.id.toString() },
      data,
    });

    return SessionMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.session.delete({
      where: { id },
    });
  }
}


import { Inject, Injectable } from "@nestjs/common";
import { ClinicMembershipRepository } from "@/domain/application/repositories/clinic-membership-repository";
import { ClinicMembership } from "@/domain/enterprise/entities/clinic-membership";
import { PrismaService } from "../../prisma.service";
import { ClinicMembershipMapper } from "../mappers/clinic-membership-mapper";
import type { Prisma } from "@prisma/client";

@Injectable()
export class PrismaClinicMembershipRepository extends ClinicMembershipRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async findByUserAndClinic(userId: string, clinicId: string): Promise<ClinicMembership | null> {
    const raw = await this.prisma.clinicMembership.findUnique({
      where: {
        userId_clinicId: {
          userId,
          clinicId,
        },
      },
    });

    if (!raw) return null;

    return ClinicMembershipMapper.toDomain(raw);
  }

  async findByClinicId(clinicId: string): Promise<ClinicMembership[]> {
    const raw = await this.prisma.clinicMembership.findMany({
      where: { clinicId },
      orderBy: { createdAt: 'desc' },
    });

    return raw.map(ClinicMembershipMapper.toDomain);
  }

  async create(membership: ClinicMembership, tx?: unknown): Promise<ClinicMembership> {
    const data = ClinicMembershipMapper.toPrisma(membership);
    const prismaClient = (tx as Prisma.TransactionClient) || this.prisma;
    const raw = await prismaClient.clinicMembership.create({
      data: {
        id: data.id,
        role: data.role,
        createdAt: data.createdAt,
        user: { connect: { id: data.userId } },
        clinic: { connect: { id: data.clinicId } },
      },
    });
    return ClinicMembershipMapper.toDomain(raw);
  }
}


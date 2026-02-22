import { Inject, Injectable } from "@nestjs/common";
import { ProfessionalRepository } from "@/domain/application/repositories/professional-repository";
import { Professional } from "@/domain/enterprise/entities/professional";
import { PrismaService } from "../../prisma.service";
import { ProfessionalMapper } from "../mappers/professional-mapper";
import type { Prisma } from "@prisma/client";

@Injectable()
export class PrismaProfessionalRepository extends ProfessionalRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(professional: Professional, tx?: unknown): Promise<Professional> {
    const data = ProfessionalMapper.toPrisma(professional);
    const prismaClient = (tx as Prisma.TransactionClient) || this.prisma;
    
    const raw = await prismaClient.professional.create({ data });
    return ProfessionalMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Professional | null> {
    const raw = await this.prisma.professional.findUnique({ where: { id } });
    if (!raw) return null;
    return ProfessionalMapper.toDomain(raw);
  }

  async findByUserIdAndFranchiseId(
    userId: string,
    franchiseId: string
  ): Promise<Professional | null> {
    const raw = await this.prisma.professional.findUnique({
      where: {
        userId_franchiseId: {
          userId,
          franchiseId,
        },
      },
    });

    if (!raw) return null;

    return ProfessionalMapper.toDomain(raw);
  }

  async findByFranchiseId(franchiseId: string): Promise<Professional[]> {
    const raw = await this.prisma.professional.findMany({
      where: { franchiseId },
      orderBy: { createdAt: 'desc' },
    });

    return raw.map(ProfessionalMapper.toDomain);
  }

  async findByClinicId(clinicId: string): Promise<Professional[]> {
    const raw = await this.prisma.professional.findMany({
      where: {
        franchise: {
          clinicId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return raw.map(ProfessionalMapper.toDomain);
  }

  async update(professional: Professional): Promise<Professional> {
    const data = ProfessionalMapper.toPrismaUpdate(professional);
    const raw = await this.prisma.professional.update({
      where: { id: professional.id.toString() },
      data,
    });
    return ProfessionalMapper.toDomain(raw);
  }
}


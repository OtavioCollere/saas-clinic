import { Inject, Injectable } from "@nestjs/common";
import { FranchiseRepository } from "@/domain/application/repositories/franchise-repository";
import { Franchise } from "@/domain/enterprise/entities/franchise";
import { PrismaService } from "../../prisma.service";
import { FranchiseMapper } from "../mappers/franchise-mapper";
import type { Prisma } from "@prisma/client";

@Injectable()
export class PrismaFranchiseRepository extends FranchiseRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(franchise: Franchise, tx?: unknown): Promise<Franchise> {
    const data = FranchiseMapper.toPrisma(franchise);
    const client = (tx as Prisma.TransactionClient) ?? this.prisma;
    const raw = await client.franchise.create({ data });
    return FranchiseMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Franchise | null> {
    const raw = await this.prisma.franchise.findUnique({ where: { id } });
    if (!raw) return null;
    return FranchiseMapper.toDomain(raw);
  }

  async findByClinicId(clinicId: string): Promise<Franchise[]> {
    const raw = await this.prisma.franchise.findMany({
      where: { clinicId },
      orderBy: { createdAt: 'desc' },
    });
    return raw.map(FranchiseMapper.toDomain);
  }

  async update(franchise: Franchise): Promise<Franchise> {
    const data = FranchiseMapper.toPrisma(franchise);
    const raw = await this.prisma.franchise.update({
      where: { id: franchise.id.toString() },
      data,
    });
    return FranchiseMapper.toDomain(raw);
  }
}


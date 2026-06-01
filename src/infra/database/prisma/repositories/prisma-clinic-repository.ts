import { Inject, Injectable } from "@nestjs/common";
import { ClinicRepository } from "@/domain/application/repositories/clinic-repository";
import { Clinic } from "@/domain/enterprise/entities/clinic";
import { PrismaService } from "../../prisma.service";
import { ClinicMapper } from "../mappers/clinic-mapper";
import type { PaginationParams } from "@/shared/types/pagination-params";

// NOTE: As tabelas Clinic ainda não existem no schema.prisma
// Este repositório será funcional quando as tabelas forem criadas
@Injectable()
export class PrismaClinicRepository extends ClinicRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(clinic: Clinic, tx?: unknown): Promise<Clinic> {
    const data = ClinicMapper.toPrisma(clinic);
    const client = (tx as typeof this.prisma) ?? this.prisma;
    const raw = await client.clinic.create({ data });
    return ClinicMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Clinic | null> {
    const raw = await this.prisma.clinic.findUnique({ where: { id } });
    if (!raw) return null;
    return ClinicMapper.toDomain(raw);
  }

  async findBySlug(slug: string): Promise<Clinic | null> {
    const raw = await this.prisma.clinic.findUnique({
      where: { slug },
    });

    if (!raw) return null;

    return ClinicMapper.toDomain(raw);
  }

  async findByName(name: string): Promise<Clinic | null> {
    const raw = await this.prisma.clinic.findFirst({
      where: { name },
    });

    if (!raw) return null;

    return ClinicMapper.toDomain(raw);
  }

  async findByCnpj(cnpj: string): Promise<Clinic | null> {
    const raw = await this.prisma.clinic.findUnique({
      where: { cnpj },
    });

    if (!raw) return null;

    return ClinicMapper.toDomain(raw);
  }

  async findByOwnerId(ownerId: string): Promise<Clinic | null> {
    const raw = await this.prisma.clinic.findFirst({
      where: { ownerId },
    });

    if (!raw) return null;

    return ClinicMapper.toDomain(raw);
  }

  async update(clinic: Clinic): Promise<Clinic> {
    const data = ClinicMapper.toPrisma(clinic);
    const raw = await this.prisma.clinic.update({
      where: { id: clinic.id.toString() },
      data,
    });
    return ClinicMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.clinic.delete({
      where: { id },
    });
  }

  async fetch({ query, page, pageSize }: PaginationParams): Promise<Clinic[]> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = query
      ? {
          name: {
            contains: query,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const raw = await this.prisma.clinic.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    return raw.map(ClinicMapper.toDomain);
  }
}




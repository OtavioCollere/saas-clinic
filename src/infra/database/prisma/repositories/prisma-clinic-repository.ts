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

  async create(clinic: Clinic): Promise<Clinic> {
    // TODO: Implementar quando tabela Clinic for criada no schema.prisma
    // const data = ClinicMapper.toPrisma(clinic);
    // const raw = await this.prisma.clinic.create({ data });
    // return ClinicMapper.toDomain(raw);
    throw new Error("Clinic table not yet created in Prisma schema");
  }

  async findById(id: string): Promise<Clinic | null> {
    // TODO: Implementar quando tabela Clinic for criada
    // const raw = await this.prisma.clinic.findUnique({ where: { id } });
    // if (!raw) return null;
    // return ClinicMapper.toDomain(raw);
    throw new Error("Clinic table not yet created in Prisma schema");
  }

  async findBySlug(slug: string): Promise<Clinic | null> {
    // TODO: Implementar quando tabela Clinic for criada
    throw new Error("Clinic table not yet created in Prisma schema");
  }

  async findByOwnerId(ownerId: string): Promise<Clinic | null> {
    // TODO: Implementar quando tabela Clinic for criada
    throw new Error("Clinic table not yet created in Prisma schema");
  }

  async update(clinic: Clinic): Promise<Clinic> {
    // TODO: Implementar quando tabela Clinic for criada
    throw new Error("Clinic table not yet created in Prisma schema");
  }

  async delete(id: string): Promise<void> {
    // TODO: Implementar quando tabela Clinic for criada
    throw new Error("Clinic table not yet created in Prisma schema");
  }

  async fetch({ query, page, pageSize }: PaginationParams): Promise<Clinic[]> {
    // TODO: Implementar quando tabela Clinic for criada
    throw new Error("Clinic table not yet created in Prisma schema");
  }
}


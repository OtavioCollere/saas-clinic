import { Inject, Injectable } from "@nestjs/common";
import { PatientRepository } from "@/domain/application/repositories/patient-repository";
import { Patient } from "@/domain/enterprise/entities/patient";
import { PrismaService } from "../../prisma.service";
import type { PaginationParams } from "@/shared/types/pagination-params";

// NOTE: As tabelas Patient ainda não existem no schema.prisma
// Este repositório será funcional quando as tabelas forem criadas
@Injectable()
export class PrismaPatientRepository extends PatientRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(patient: Patient): Promise<Patient> {
    // TODO: Implementar quando tabela Patient for criada no schema.prisma
    throw new Error("Patient table not yet created in Prisma schema");
  }

  async findById(id: string): Promise<Patient | null> {
    // TODO: Implementar quando tabela Patient for criada
    throw new Error("Patient table not yet created in Prisma schema");
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    // TODO: Implementar quando tabela Patient for criada
    throw new Error("Patient table not yet created in Prisma schema");
  }

  async findByClinicId(clinicId: string): Promise<Patient[]> {
    // TODO: Implementar quando tabela Patient for criada
    throw new Error("Patient table not yet created in Prisma schema");
  }

  async update(patient: Patient): Promise<Patient> {
    // TODO: Implementar quando tabela Patient for criada
    throw new Error("Patient table not yet created in Prisma schema");
  }

  async fetch({ query, page, pageSize }: PaginationParams): Promise<Patient[]> {
    // TODO: Implementar quando tabela Patient for criada
    throw new Error("Patient table not yet created in Prisma schema");
  }
}


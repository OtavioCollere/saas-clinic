import { Inject, Injectable } from "@nestjs/common";
import { AnamnesisRepository } from "@/domain/application/repositories/anamnesis-repository";
import { Anamnesis } from "@/domain/enterprise/entities/anamnesis/anamnesis";
import { PrismaService } from "../../prisma.service";

// NOTE: As tabelas Anamnesis ainda não existem no schema.prisma
// Este repositório será funcional quando as tabelas forem criadas
@Injectable()
export class PrismaAnamnesisRepository extends AnamnesisRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(anamnesis: Anamnesis): Promise<Anamnesis> {
    // TODO: Implementar quando tabela Anamnesis for criada no schema.prisma
    throw new Error("Anamnesis table not yet created in Prisma schema");
  }

  async findById(id: string): Promise<Anamnesis | null> {
    // TODO: Implementar quando tabela Anamnesis for criada
    throw new Error("Anamnesis table not yet created in Prisma schema");
  }

  async findByPatientId(patientId: string): Promise<Anamnesis | null> {
    // TODO: Implementar quando tabela Anamnesis for criada
    throw new Error("Anamnesis table not yet created in Prisma schema");
  }

  async update(anamnesis: Anamnesis): Promise<Anamnesis> {
    // TODO: Implementar quando tabela Anamnesis for criada
    throw new Error("Anamnesis table not yet created in Prisma schema");
  }
}


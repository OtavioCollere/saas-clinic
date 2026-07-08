import { Inject, Injectable } from "@nestjs/common";
import { ProcedureRepository } from "@/domain/application/repositories/procedure-repository";
import { Procedure } from "@/domain/enterprise/entities/procedure";
import { PrismaService } from "../../prisma.service";
import { ProcedureMapper } from "../mappers/procedure-mapper";
import type { Prisma } from "@prisma/client";

@Injectable()
export class PrismaProcedureRepository extends ProcedureRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(procedure: Procedure): Promise<Procedure> {
    const data = ProcedureMapper.toPrisma(procedure);
    const raw = await this.prisma.procedure.create({ data });
    return ProcedureMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Procedure | null> {
    const raw = await this.prisma.procedure.findUnique({ where: { id } });
    if (!raw) return null;
    return ProcedureMapper.toDomain(raw);
  }

  async findByFranchiseId(franchiseId: string): Promise<Procedure[]> {
    const raw = await this.prisma.procedure.findMany({
      where: { franchiseId },
      orderBy: { createdAt: 'desc' },
    });
    return raw.map(ProcedureMapper.toDomain);
  }

  async findByClinicId(clinicId: string): Promise<Procedure[]> {
    // Busca todas as franquias da clínica e depois os procedimentos
    const franchises = await this.prisma.franchise.findMany({
      where: { clinicId },
      select: { id: true },
    });

    const franchiseIds = franchises.map(f => f.id);

    if (franchiseIds.length === 0) {
      return [];
    }

    const raw = await this.prisma.procedure.findMany({
      where: {
        franchiseId: {
          in: franchiseIds,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return raw.map(ProcedureMapper.toDomain);
  }

  async update(procedure: Procedure): Promise<Procedure> {
    const data = ProcedureMapper.toPrismaUpdate(procedure);
    const raw = await this.prisma.procedure.update({
      where: { id: procedure.id.toString() },
      data,
    });
    return ProcedureMapper.toDomain(raw);
  }

  async hasAppointments(procedureId: string): Promise<boolean> {
    const count = await this.prisma.appointmentItem.count({
      where: { procedureId },
    });
    return count > 0;
  }

  async delete(procedureId: string): Promise<void> {
    await this.prisma.procedure.delete({
      where: { id: procedureId },
    });
  }
}


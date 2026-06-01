import { Inject, Injectable } from "@nestjs/common";
import { ProcedureSupplyTemplateRepository } from "@/domain/application/repositories/procedure-supply-template-repository";
import { ProcedureSupplyTemplate } from "@/domain/enterprise/entities/procedure-supply-template";
import { PrismaService } from "../../prisma.service";
import { ProcedureSupplyTemplateMapper } from "../mappers/procedure-supply-template-mapper";

@Injectable()
export class PrismaProcedureSupplyTemplateRepository extends ProcedureSupplyTemplateRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {
    super();
  }

  async upsert(template: ProcedureSupplyTemplate): Promise<ProcedureSupplyTemplate> {
    const args = ProcedureSupplyTemplateMapper.toPrismaUpsert(template);
    const raw = await this.prisma.procedureSupplyTemplate.upsert(args);
    return ProcedureSupplyTemplateMapper.toDomain(raw);
  }

  async findByProcedureId(procedureId: string): Promise<ProcedureSupplyTemplate[]> {
    const rows = await this.prisma.procedureSupplyTemplate.findMany({
      where: { procedureId, active: true },
    });
    return rows.map(ProcedureSupplyTemplateMapper.toDomain);
  }

  async findByProcedureIds(procedureIds: string[]): Promise<ProcedureSupplyTemplate[]> {
    if (procedureIds.length === 0) return [];
    const rows = await this.prisma.procedureSupplyTemplate.findMany({
      where: { procedureId: { in: procedureIds }, active: true },
    });
    return rows.map(ProcedureSupplyTemplateMapper.toDomain);
  }

  async findById(id: string): Promise<ProcedureSupplyTemplate | null> {
    const raw = await this.prisma.procedureSupplyTemplate.findUnique({ where: { id } });
    if (!raw) return null;
    return ProcedureSupplyTemplateMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.procedureSupplyTemplate.delete({ where: { id } });
  }
}

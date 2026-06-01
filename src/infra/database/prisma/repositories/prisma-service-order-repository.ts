import { Inject, Injectable } from "@nestjs/common";
import { ServiceOrderRepository } from "@/domain/application/repositories/service-order-repository";
import { ServiceOrder } from "@/domain/enterprise/entities/service-order";
import { PrismaService } from "../../prisma.service";
import { ServiceOrderMapper } from "../mappers/service-order-mapper";

@Injectable()
export class PrismaServiceOrderRepository extends ServiceOrderRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService
  ) {
    super();
  }

  async create(serviceOrder: ServiceOrder): Promise<void> {
    const data = ServiceOrderMapper.toPrisma(serviceOrder);
    await this.prisma.serviceOrder.create({ data });
  }

  async findById(id: string): Promise<ServiceOrder | null> {
    const raw = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!raw) return null;
    return ServiceOrderMapper.toDomain(raw);
  }

  async markConsumptionStatus(id: string, status: "CONFIRMED" | "SKIPPED"): Promise<void> {
    await this.prisma.serviceOrder.update({
      where: { id },
      data: { consumptionStatus: status, updatedAt: new Date() },
    });
  }
}

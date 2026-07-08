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

  async create(serviceOrder: ServiceOrder, franchiseId?: string, appointmentId?: string): Promise<void> {
    const data = ServiceOrderMapper.toPrisma(serviceOrder);
    await this.prisma.serviceOrder.create({
      data: { ...data, franchiseId: franchiseId ?? null, appointmentId: appointmentId ?? null },
    });
  }

  async findById(id: string): Promise<ServiceOrder | null> {
    const raw = await this.prisma.serviceOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!raw) return null;
    return ServiceOrderMapper.toDomain(raw);
  }

  async findByFranchiseId(franchiseId: string, status?: string): Promise<ServiceOrder[]> {
    const raws = await this.prisma.serviceOrder.findMany({
      where: {
        franchiseId,
        ...(status ? { status } : {}),
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return raws.map((r) => ServiceOrderMapper.toDomain(r));
  }

  async findByPatientId(patientId: string): Promise<ServiceOrder[]> {
    const raws = await this.prisma.serviceOrder.findMany({
      where: {
        appointment: { patientId },
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return raws.map((r) => ServiceOrderMapper.toDomain(r));
  }

  async markAsPaid(id: string, paidAt: Date): Promise<void> {
    await this.prisma.serviceOrder.update({
      where: { id },
      data: { status: "PAID", paidAt, updatedAt: new Date() },
    });
  }
}

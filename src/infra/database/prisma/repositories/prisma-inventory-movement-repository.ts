import { Inject, Injectable } from "@nestjs/common";
import { InventoryMovementRepository } from "@/domain/application/repositories/inventory-movement-repository";
import { InventoryMovement } from "@/domain/enterprise/entities/inventory-movement";
import { PrismaService } from "../../prisma.service";
import { InventoryMovementMapper } from "../mappers/inventory-movement-mapper";

@Injectable()
export class PrismaInventoryMovementRepository extends InventoryMovementRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {
    super();
  }

  async create(movement: InventoryMovement): Promise<InventoryMovement> {
    const data = InventoryMovementMapper.toPrismaCreate(movement);
    const raw = await this.prisma.inventoryMovement.create({ data });
    return InventoryMovementMapper.toDomain(raw);
  }

  async findByServiceOrderId(serviceOrderId: string): Promise<InventoryMovement[]> {
    const rows = await this.prisma.inventoryMovement.findMany({
      where: { serviceOrderId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(InventoryMovementMapper.toDomain);
  }
}

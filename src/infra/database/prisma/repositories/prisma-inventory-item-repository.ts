import { Inject, Injectable } from "@nestjs/common";
import { InventoryItemRepository } from "@/domain/application/repositories/inventory-item-repository";
import { InventoryItem } from "@/domain/enterprise/entities/inventory-item";
import { PrismaService } from "../../prisma.service";
import { InventoryItemMapper } from "../mappers/inventory-item-mapper";

@Injectable()
export class PrismaInventoryItemRepository extends InventoryItemRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {
    super();
  }

  async create(item: InventoryItem): Promise<InventoryItem> {
    const data = InventoryItemMapper.toPrismaCreate(item);
    const raw = await this.prisma.inventoryItem.create({ data });
    return InventoryItemMapper.toDomain(raw);
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const raw = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!raw) return null;
    return InventoryItemMapper.toDomain(raw);
  }

  async findByClinicId(clinicId: string): Promise<InventoryItem[]> {
    const rows = await this.prisma.inventoryItem.findMany({
      where: { clinicId, active: true },
      orderBy: { name: "asc" },
    });
    return rows.map(InventoryItemMapper.toDomain);
  }

  async findByIds(ids: string[]): Promise<InventoryItem[]> {
    if (ids.length === 0) return [];
    const rows = await this.prisma.inventoryItem.findMany({
      where: { id: { in: ids } },
    });
    return rows.map(InventoryItemMapper.toDomain);
  }

  async update(item: InventoryItem): Promise<void> {
    const data = InventoryItemMapper.toPrismaUpdate(item);
    await this.prisma.inventoryItem.update({
      where: { id: item.id.toString() },
      data,
    });
  }
}

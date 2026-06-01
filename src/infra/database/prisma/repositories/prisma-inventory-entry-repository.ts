import { Inject, Injectable } from "@nestjs/common";
import { InventoryEntryRepository } from "@/domain/application/repositories/inventory-entry-repository";
import { InventoryEntry } from "@/domain/enterprise/entities/inventory-entry";
import { PrismaService } from "../../prisma.service";
import { InventoryEntryMapper } from "../mappers/inventory-entry-mapper";

@Injectable()
export class PrismaInventoryEntryRepository extends InventoryEntryRepository {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {
    super();
  }

  async create(entry: InventoryEntry): Promise<InventoryEntry> {
    const data = InventoryEntryMapper.toPrismaCreate(entry);
    const raw = await this.prisma.inventoryEntry.create({ data });
    return InventoryEntryMapper.toDomain(raw);
  }
}

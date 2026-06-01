import { InventoryItem } from "@/domain/enterprise/entities/inventory-item";
import { InventoryCategory } from "@/domain/enterprise/value-objects/inventory-category";
import { type Either, makeRight } from "@/shared/either/either";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { Inject, Injectable } from "@nestjs/common";
import { InventoryItemRepository } from "../../repositories/inventory-item-repository";

interface Request {
  clinicId: string;
  franchiseId?: string;
  name: string;
  category: string;
  unitType: string;
  minimumQuantity: number;
  averageCost?: number;
  supplier?: string;
}

type Response = Either<never, { item: InventoryItem }>;

@Injectable()
export class CreateInventoryItemUseCase {
  constructor(
    @Inject(InventoryItemRepository)
    private inventoryItemRepository: InventoryItemRepository,
  ) {}

  async execute(request: Request): Promise<Response> {
    const item = InventoryItem.create({
      clinicId: new UniqueEntityId(request.clinicId),
      franchiseId: request.franchiseId ? new UniqueEntityId(request.franchiseId) : undefined,
      name: request.name,
      category: InventoryCategory.create(request.category),
      unitType: request.unitType,
      currentQuantity: 0,
      minimumQuantity: request.minimumQuantity,
      averageCost: request.averageCost ?? 0,
      supplier: request.supplier,
    });

    await this.inventoryItemRepository.create(item);
    return makeRight({ item });
  }
}

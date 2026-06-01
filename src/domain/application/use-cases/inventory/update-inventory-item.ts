import type { InventoryItem } from "@/domain/enterprise/entities/inventory-item";
import { InventoryCategory } from "@/domain/enterprise/value-objects/inventory-category";
import { type Either, makeLeft, makeRight } from "@/shared/either/either";
import { InventoryItemNotFoundError } from "@/shared/errors/inventory-item-not-found-error";
import { Inject, Injectable } from "@nestjs/common";
import { InventoryItemRepository } from "../../repositories/inventory-item-repository";

interface Request {
  id: string;
  name?: string;
  category?: string;
  unitType?: string;
  minimumQuantity?: number;
  supplier?: string;
  active?: boolean;
}

type Response = Either<InventoryItemNotFoundError, { item: InventoryItem }>;

@Injectable()
export class UpdateInventoryItemUseCase {
  constructor(
    @Inject(InventoryItemRepository)
    private inventoryItemRepository: InventoryItemRepository,
  ) {}

  async execute(request: Request): Promise<Response> {
    const item = await this.inventoryItemRepository.findById(request.id);
    if (!item) return makeLeft(new InventoryItemNotFoundError());

    item.update({
      name: request.name,
      category: request.category ? InventoryCategory.create(request.category) : undefined,
      unitType: request.unitType,
      minimumQuantity: request.minimumQuantity,
      supplier: request.supplier,
      active: request.active,
    });

    await this.inventoryItemRepository.update(item);
    return makeRight({ item });
  }
}

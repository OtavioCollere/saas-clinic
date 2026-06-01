import { Inject, Injectable } from "@nestjs/common";
import { type Either, makeLeft, makeRight } from "@/shared/either/either";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { InventoryEntry } from "@/domain/enterprise/entities/inventory-entry";
import { InventoryMovement } from "@/domain/enterprise/entities/inventory-movement";
import { InventoryItemRepository } from "../../repositories/inventory-item-repository";
import { InventoryEntryRepository } from "../../repositories/inventory-entry-repository";
import { InventoryMovementRepository } from "../../repositories/inventory-movement-repository";
import { InventoryItemNotFoundError } from "@/shared/errors/inventory-item-not-found-error";

interface Request {
  clinicId: string;
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  supplier?: string;
  batchNumber?: string;
  expirationDate?: Date;
  notes?: string;
  createdBy: string;
}

type Response = Either<InventoryItemNotFoundError, { entry: InventoryEntry }>;

@Injectable()
export class CreateInventoryEntryUseCase {
  constructor(
    @Inject(InventoryItemRepository)
    private inventoryItemRepository: InventoryItemRepository,
    @Inject(InventoryEntryRepository)
    private inventoryEntryRepository: InventoryEntryRepository,
    @Inject(InventoryMovementRepository)
    private inventoryMovementRepository: InventoryMovementRepository,
  ) {}

  async execute(request: Request): Promise<Response> {
    const item = await this.inventoryItemRepository.findById(request.inventoryItemId);
    if (!item) return makeLeft(new InventoryItemNotFoundError());

    // Weighted moving average cost
    const oldQty = item.currentQuantity;
    const oldAvg = item.averageCost;
    const totalQty = oldQty + request.quantity;
    const newAvgCost = totalQty > 0
      ? (oldQty * oldAvg + request.quantity * request.unitCost) / totalQty
      : request.unitCost;

    const entry = InventoryEntry.create({
      clinicId: new UniqueEntityId(request.clinicId),
      inventoryItemId: new UniqueEntityId(request.inventoryItemId),
      quantity: request.quantity,
      unitCost: request.unitCost,
      totalCost: request.quantity * request.unitCost,
      supplier: request.supplier,
      batchNumber: request.batchNumber,
      expirationDate: request.expirationDate,
      notes: request.notes,
      createdBy: request.createdBy,
    });

    await this.inventoryEntryRepository.create(entry);

    const movement = InventoryMovement.create({
      clinicId: new UniqueEntityId(request.clinicId),
      inventoryItemId: new UniqueEntityId(request.inventoryItemId),
      type: "ENTRADA",
      quantity: request.quantity,
      unitCost: request.unitCost,
      inventoryEntryId: entry.id.toString(),
      createdBy: request.createdBy,
    });

    await this.inventoryMovementRepository.create(movement);

    item.addStock(request.quantity, newAvgCost);
    await this.inventoryItemRepository.update(item);

    return makeRight({ entry });
  }
}

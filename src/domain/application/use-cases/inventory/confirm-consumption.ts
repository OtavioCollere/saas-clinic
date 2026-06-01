import { Inject, Injectable } from "@nestjs/common";
import { type Either, makeRight } from "@/shared/either/either";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { InventoryMovement } from "@/domain/enterprise/entities/inventory-movement";
import { InventoryItemRepository } from "../../repositories/inventory-item-repository";
import { InventoryMovementRepository } from "../../repositories/inventory-movement-repository";
import { ServiceOrderRepository } from "../../repositories/service-order-repository";

export interface ConsumptionItem {
  inventoryItemId: string;
  quantity: number;
}

interface Request {
  clinicId: string;
  serviceOrderId: string;
  items: ConsumptionItem[];
  professionalId?: string;
  franchiseId?: string;
  createdBy: string;
  skip?: boolean;
}

type Response = Either<never, { confirmed: number }>;

@Injectable()
export class ConfirmConsumptionUseCase {
  constructor(
    @Inject(InventoryItemRepository)
    private inventoryItemRepository: InventoryItemRepository,
    @Inject(InventoryMovementRepository)
    private inventoryMovementRepository: InventoryMovementRepository,
    @Inject(ServiceOrderRepository)
    private serviceOrderRepository: ServiceOrderRepository,
  ) {}

  async execute(request: Request): Promise<Response> {
    if (request.skip) {
      await this.serviceOrderRepository.markConsumptionStatus(request.serviceOrderId, "SKIPPED");
      return makeRight({ confirmed: 0 });
    }

    const validItems = request.items.filter((i) => i.quantity > 0);

    for (const consumptionItem of validItems) {
      const item = await this.inventoryItemRepository.findById(consumptionItem.inventoryItemId);
      if (!item) continue;

      const movement = InventoryMovement.create({
        clinicId: new UniqueEntityId(request.clinicId),
        inventoryItemId: new UniqueEntityId(consumptionItem.inventoryItemId),
        type: "SAIDA",
        quantity: consumptionItem.quantity,
        unitCost: item.averageCost,
        serviceOrderId: request.serviceOrderId,
        professionalId: request.professionalId,
        franchiseId: request.franchiseId,
        createdBy: request.createdBy,
      });

      await this.inventoryMovementRepository.create(movement);
      item.removeStock(consumptionItem.quantity);
      await this.inventoryItemRepository.update(item);
    }

    await this.serviceOrderRepository.markConsumptionStatus(request.serviceOrderId, "CONFIRMED");

    return makeRight({ confirmed: validItems.length });
  }
}

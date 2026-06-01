import { Inject, Injectable } from "@nestjs/common";
import { type Either, makeRight } from "@/shared/either/either";
import { ProcedureSupplyTemplateRepository } from "../../repositories/procedure-supply-template-repository";
import { InventoryItemRepository } from "../../repositories/inventory-item-repository";
import { ServiceOrderRepository } from "../../repositories/service-order-repository";

export interface ConsumptionSuggestionItem {
  inventoryItemId: string;
  inventoryItemName: string;
  unitType: string;
  suggestedQuantity: number;
  currentStock: number;
  averageCost: number;
  isRequired: boolean;
}

interface Request {
  serviceOrderId: string;
}

type Response = Either<never, { suggestions: ConsumptionSuggestionItem[] }>;

@Injectable()
export class GetConsumptionSuggestionUseCase {
  constructor(
    @Inject(ServiceOrderRepository)
    private serviceOrderRepository: ServiceOrderRepository,
    @Inject(ProcedureSupplyTemplateRepository)
    private templateRepository: ProcedureSupplyTemplateRepository,
    @Inject(InventoryItemRepository)
    private inventoryItemRepository: InventoryItemRepository,
  ) {}

  async execute({ serviceOrderId }: Request): Promise<Response> {
    const serviceOrder = await this.serviceOrderRepository.findById(serviceOrderId);

    if (!serviceOrder) {
      return makeRight({ suggestions: [] });
    }

    // Collect unique procedure IDs from the service order items
    const procedureIds = [...new Set(
      serviceOrder.items
        .map((i) => i.procedureId?.toString())
        .filter((id): id is string => !!id)
    )];

    if (procedureIds.length === 0) {
      return makeRight({ suggestions: [] });
    }

    const templates = await this.templateRepository.findByProcedureIds(procedureIds);

    // Aggregate quantities per inventory item (same item may appear across multiple procedures)
    const aggregated = new Map<string, { quantity: number; isRequired: boolean }>();
    for (const tpl of templates) {
      if (!tpl.active) continue;
      const itemId = tpl.inventoryItemId.toString();
      const existing = aggregated.get(itemId);
      if (existing) {
        existing.quantity += tpl.defaultQuantity;
        existing.isRequired = existing.isRequired || tpl.isRequired;
      } else {
        aggregated.set(itemId, { quantity: tpl.defaultQuantity, isRequired: tpl.isRequired });
      }
    }

    if (aggregated.size === 0) {
      return makeRight({ suggestions: [] });
    }

    const inventoryItems = await this.inventoryItemRepository.findByIds([...aggregated.keys()]);

    const suggestions: ConsumptionSuggestionItem[] = inventoryItems
      .filter((item) => item.active)
      .map((item) => {
        const agg = aggregated.get(item.id.toString())!;
        return {
          inventoryItemId: item.id.toString(),
          inventoryItemName: item.name,
          unitType: item.unitType,
          suggestedQuantity: agg.quantity,
          currentStock: item.currentQuantity,
          averageCost: item.averageCost,
          isRequired: agg.isRequired,
        };
      });

    return makeRight({ suggestions });
  }
}

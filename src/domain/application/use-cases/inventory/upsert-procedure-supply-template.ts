import { Inject, Injectable } from "@nestjs/common";
import { type Either, makeLeft, makeRight } from "@/shared/either/either";
import { UniqueEntityId } from "@/shared/entities/unique-entity-id";
import { ProcedureSupplyTemplate } from "@/domain/enterprise/entities/procedure-supply-template";
import { ProcedureSupplyTemplateRepository } from "../../repositories/procedure-supply-template-repository";
import { InventoryItemRepository } from "../../repositories/inventory-item-repository";
import { InventoryItemNotFoundError } from "@/shared/errors/inventory-item-not-found-error";

interface Request {
  clinicId: string;
  procedureId: string;
  inventoryItemId: string;
  defaultQuantity: number;
  isRequired?: boolean;
}

type Response = Either<InventoryItemNotFoundError, { template: ProcedureSupplyTemplate }>;

@Injectable()
export class UpsertProcedureSupplyTemplateUseCase {
  constructor(
    @Inject(ProcedureSupplyTemplateRepository)
    private templateRepository: ProcedureSupplyTemplateRepository,
    @Inject(InventoryItemRepository)
    private inventoryItemRepository: InventoryItemRepository,
  ) {}

  async execute(request: Request): Promise<Response> {
    const item = await this.inventoryItemRepository.findById(request.inventoryItemId);
    if (!item) return makeLeft(new InventoryItemNotFoundError());

    const template = ProcedureSupplyTemplate.create({
      clinicId: new UniqueEntityId(request.clinicId),
      procedureId: new UniqueEntityId(request.procedureId),
      inventoryItemId: new UniqueEntityId(request.inventoryItemId),
      defaultQuantity: request.defaultQuantity,
      isRequired: request.isRequired ?? true,
    });

    const saved = await this.templateRepository.upsert(template);
    return makeRight({ template: saved });
  }
}

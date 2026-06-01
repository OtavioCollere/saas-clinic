import { Inject, Injectable } from "@nestjs/common";
import { type Either, makeRight } from "@/shared/either/either";
import { InventoryItemRepository } from "../../repositories/inventory-item-repository";
import type { InventoryItem } from "@/domain/enterprise/entities/inventory-item";

interface Request { clinicId: string }
type Response = Either<never, { items: InventoryItem[] }>;

@Injectable()
export class ListInventoryItemsByClinicUseCase {
  constructor(
    @Inject(InventoryItemRepository)
    private inventoryItemRepository: InventoryItemRepository,
  ) {}

  async execute({ clinicId }: Request): Promise<Response> {
    const items = await this.inventoryItemRepository.findByClinicId(clinicId);
    return makeRight({ items });
  }
}

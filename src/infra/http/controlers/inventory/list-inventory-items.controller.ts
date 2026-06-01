import { Inject, Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { unwrapEither } from "@/shared/either/either";
import { ListInventoryItemsByClinicUseCase } from "@/domain/application/use-cases/inventory/list-inventory-items-by-clinic";
import { InventoryItemPresenter } from "../../presenters/inventory-item-presenter";

@ApiTags("Inventory")
@Controller("/clinics/:clinicId/inventory/items")
export class ListInventoryItemsController {
  constructor(
    @Inject(ListInventoryItemsByClinicUseCase)
    private useCase: ListInventoryItemsByClinicUseCase,
  ) {}

  @Get()
  async handle(@Param("clinicId") clinicId: string) {
    const result = await this.useCase.execute({ clinicId });
    const { items } = unwrapEither(result);
    return items.map(InventoryItemPresenter.toHTTP);
  }
}

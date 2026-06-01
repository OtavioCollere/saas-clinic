import { UpdateInventoryItemUseCase } from "@/domain/application/use-cases/inventory/update-inventory-item";
import { INVENTORY_CATEGORY_VALUES } from "@/domain/enterprise/value-objects/inventory-category";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { InventoryItemNotFoundError } from "@/shared/errors/inventory-item-not-found-error";
import { Body, Controller, Inject, NotFoundException, Param, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { InventoryItemPresenter } from "../../presenters/inventory-item-presenter";

const schema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(INVENTORY_CATEGORY_VALUES).optional(),
  unitType: z.enum(["UNIDADE", "ML", "FRASCO", "SERINGA", "AMPOLA", "CAIXA", "OUTRO"]).optional(),
  minimumQuantity: z.number().min(0).optional(),
  supplier: z.string().optional(),
  active: z.boolean().optional(),
});

type Schema = z.infer<typeof schema>;

@ApiTags("Inventory")
@Controller("/clinics/:clinicId/inventory/items")
export class UpdateInventoryItemController {
  constructor(
    @Inject(UpdateInventoryItemUseCase)
    private useCase: UpdateInventoryItemUseCase,
  ) {}

  @Patch(":id")
  async handle(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(schema)) body: Schema,
  ) {
    const result = await this.useCase.execute({ id, ...body });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      if (error instanceof InventoryItemNotFoundError) throw new NotFoundException(error.message);
      throw new NotFoundException();
    }

    const { item } = unwrapEither(result);
    return InventoryItemPresenter.toHTTP(item);
  }
}

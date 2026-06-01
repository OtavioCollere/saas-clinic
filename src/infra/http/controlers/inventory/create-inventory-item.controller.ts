import { CreateInventoryItemUseCase } from "@/domain/application/use-cases/inventory/create-inventory-item";
import { INVENTORY_CATEGORY_VALUES } from "@/domain/enterprise/value-objects/inventory-category";
import { unwrapEither } from "@/shared/either/either";
import { Body, Controller, Inject, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { InventoryItemPresenter } from "../../presenters/inventory-item-presenter";

const schema = z.object({
  franchiseId: z.string().optional(),
  name: z.string().min(1),
  category: z.enum(INVENTORY_CATEGORY_VALUES),
  unitType: z.enum(["UNIDADE", "ML", "FRASCO", "SERINGA", "AMPOLA", "CAIXA", "OUTRO"]),
  minimumQuantity: z.number().min(0),
  averageCost: z.number().min(0).optional(),
  supplier: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

@ApiTags("Inventory")
@Controller("/clinics/:clinicId/inventory/items")
export class CreateInventoryItemController {
  constructor(
    @Inject(CreateInventoryItemUseCase)
    private useCase: CreateInventoryItemUseCase,
  ) {}

  @Post()
  async handle(
    @Param("clinicId") clinicId: string,
    @Body(new ZodValidationPipe(schema)) body: Schema,
  ) {
    const result = await this.useCase.execute({ clinicId, ...body });
    const { item } = unwrapEither(result);
    return InventoryItemPresenter.toHTTP(item);
  }
}

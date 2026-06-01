import { Inject, Body, Controller, NotFoundException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { InventoryItemNotFoundError } from "@/shared/errors/inventory-item-not-found-error";
import { UpsertProcedureSupplyTemplateUseCase } from "@/domain/application/use-cases/inventory/upsert-procedure-supply-template";
import { ProcedureSupplyTemplatePresenter } from "../../presenters/procedure-supply-template-presenter";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import z from "zod";

const schema = z.object({
  procedureId: z.string(),
  inventoryItemId: z.string(),
  defaultQuantity: z.number().positive(),
  isRequired: z.boolean().optional(),
});

type Schema = z.infer<typeof schema>;

@ApiTags("Inventory")
@Controller("/clinics/:clinicId/inventory/templates")
export class UpsertProcedureSupplyTemplateController {
  constructor(
    @Inject(UpsertProcedureSupplyTemplateUseCase)
    private useCase: UpsertProcedureSupplyTemplateUseCase,
  ) {}

  @Post()
  async handle(
    @Param("clinicId") clinicId: string,
    @Body(new ZodValidationPipe(schema)) body: Schema,
  ) {
    const result = await this.useCase.execute({ clinicId, ...body });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      if (error instanceof InventoryItemNotFoundError) throw new NotFoundException(error.message);
      throw new NotFoundException(error.message);
    }

    const { template } = unwrapEither(result);
    return ProcedureSupplyTemplatePresenter.toHTTP(template);
  }
}

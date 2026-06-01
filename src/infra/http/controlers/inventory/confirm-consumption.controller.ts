import { Inject, Body, Controller, Param, Post, Request as Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { unwrapEither } from "@/shared/either/either";
import { ConfirmConsumptionUseCase } from "@/domain/application/use-cases/inventory/confirm-consumption";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import z from "zod";

const schema = z.object({
  skip: z.boolean().optional(),
  professionalId: z.string().optional(),
  franchiseId: z.string().optional(),
  items: z.array(
    z.object({
      inventoryItemId: z.string(),
      quantity: z.number().positive(),
    })
  ).optional().default([]),
});

type Schema = z.infer<typeof schema>;

@ApiTags("Inventory")
@Controller("/clinics/:clinicId/inventory/consumption")
export class ConfirmConsumptionController {
  constructor(
    @Inject(ConfirmConsumptionUseCase)
    private useCase: ConfirmConsumptionUseCase,
  ) {}

  @Post(":serviceOrderId")
  async handle(
    @Param("clinicId") clinicId: string,
    @Param("serviceOrderId") serviceOrderId: string,
    @Body(new ZodValidationPipe(schema)) body: Schema,
    @Req() req: any,
  ) {
    const createdBy = req.user?.sub ?? "system";

    const result = await this.useCase.execute({
      clinicId,
      serviceOrderId,
      items: body.items,
      skip: body.skip,
      professionalId: body.professionalId,
      franchiseId: body.franchiseId,
      createdBy,
    });

    const { confirmed } = unwrapEither(result);
    return { confirmed, message: body.skip ? "Consumo ignorado." : `${confirmed} insumo(s) baixado(s).` };
  }
}

import { Inject, Body, Controller, NotFoundException, Param, Post, Request as Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { InventoryItemNotFoundError } from "@/shared/errors/inventory-item-not-found-error";
import { CreateInventoryEntryUseCase } from "@/domain/application/use-cases/inventory/create-inventory-entry";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import z from "zod";

const schema = z.object({
  inventoryItemId: z.string(),
  quantity: z.number().positive(),
  unitCost: z.number().min(0),
  supplier: z.string().optional(),
  batchNumber: z.string().optional(),
  expirationDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

@ApiTags("Inventory")
@Controller("/clinics/:clinicId/inventory/entries")
export class CreateInventoryEntryController {
  constructor(
    @Inject(CreateInventoryEntryUseCase)
    private useCase: CreateInventoryEntryUseCase,
  ) {}

  @Post()
  async handle(
    @Param("clinicId") clinicId: string,
    @Body(new ZodValidationPipe(schema)) body: Schema,
    @Req() req: any,
  ) {
    const createdBy = req.user?.sub ?? "system";

    const result = await this.useCase.execute({
      clinicId,
      inventoryItemId: body.inventoryItemId,
      quantity: body.quantity,
      unitCost: body.unitCost,
      supplier: body.supplier,
      batchNumber: body.batchNumber,
      expirationDate: body.expirationDate ? new Date(body.expirationDate) : undefined,
      notes: body.notes,
      createdBy,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      if (error instanceof InventoryItemNotFoundError) throw new NotFoundException(error.message);
      throw new NotFoundException(error.message);
    }

    const { entry } = unwrapEither(result);
    return {
      id: entry.id.toString(),
      inventoryItemId: entry.inventoryItemId.toString(),
      quantity: entry.quantity,
      unitCost: entry.unitCost,
      totalCost: entry.totalCost,
      createdAt: entry.createdAt,
    };
  }
}

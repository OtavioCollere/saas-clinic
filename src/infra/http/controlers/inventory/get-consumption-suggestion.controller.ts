import { Inject, Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { unwrapEither } from "@/shared/either/either";
import { GetConsumptionSuggestionUseCase } from "@/domain/application/use-cases/inventory/get-consumption-suggestion";

@ApiTags("Inventory")
@Controller("/clinics/:clinicId/inventory/consumption-suggestion")
export class GetConsumptionSuggestionController {
  constructor(
    @Inject(GetConsumptionSuggestionUseCase)
    private useCase: GetConsumptionSuggestionUseCase,
  ) {}

  @Get(":serviceOrderId")
  async handle(@Param("serviceOrderId") serviceOrderId: string) {
    const result = await this.useCase.execute({ serviceOrderId });
    const { suggestions } = unwrapEither(result);
    return suggestions;
  }
}

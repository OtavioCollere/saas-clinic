import { Inject, Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { unwrapEither } from "@/shared/either/either";
import { ListProcedureSupplyTemplatesUseCase } from "@/domain/application/use-cases/inventory/list-procedure-supply-templates";
import { ProcedureSupplyTemplatePresenter } from "../../presenters/procedure-supply-template-presenter";

@ApiTags("Inventory")
@Controller("/clinics/:clinicId/inventory/templates")
export class ListProcedureSupplyTemplatesController {
  constructor(
    @Inject(ListProcedureSupplyTemplatesUseCase)
    private useCase: ListProcedureSupplyTemplatesUseCase,
  ) {}

  @Get()
  async handle(@Query("procedureId") procedureId: string) {
    const result = await this.useCase.execute({ procedureId });
    const { templates } = unwrapEither(result);
    return templates.map(ProcedureSupplyTemplatePresenter.toHTTP);
  }
}

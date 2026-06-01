import { Inject, Controller, Delete, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { isLeft, unwrapEither } from "@/shared/either/either";
import { DeleteProcedureSupplyTemplateUseCase } from "@/domain/application/use-cases/inventory/delete-procedure-supply-template";
import { ProcedureSupplyTemplateNotFoundError } from "@/shared/errors/procedure-supply-template-not-found-error";

@ApiTags("Inventory")
@Controller("/clinics/:clinicId/inventory/templates")
export class DeleteProcedureSupplyTemplateController {
  constructor(
    @Inject(DeleteProcedureSupplyTemplateUseCase)
    private useCase: DeleteProcedureSupplyTemplateUseCase,
  ) {}

  @Delete(":id")
  async handle(@Param("id") id: string) {
    const result = await this.useCase.execute({ id });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      if (error instanceof ProcedureSupplyTemplateNotFoundError)
        throw new NotFoundException(error.message);
      throw new NotFoundException(error.message);
    }

    return { message: "Template removido com sucesso." };
  }
}

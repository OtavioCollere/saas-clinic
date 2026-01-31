import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProcedureNotFoundError } from "@/shared/errors/procedure-not-found-error";
import { GetProcedureByIdUseCase } from "@/domain/application/use-cases/procedure/get-procedure-by-id";
import { Controller, Get, NotFoundException, Param, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProcedurePresenter } from "../../presenters/procedure-presenter";

const getProcedureByIdParamsSchema = z.object({
	procedureId: z.string(),
});

type GetProcedureByIdParamsSchema = z.infer<typeof getProcedureByIdParamsSchema>;

const getProcedureByIdParamsValidationPipe = new ZodValidationPipe(getProcedureByIdParamsSchema);

@Controller("/procedures")
export class GetProcedureByIdController {
	constructor(private readonly getProcedureByIdUseCase: GetProcedureByIdUseCase) {}

	@Get("/:procedureId")
	async handle(@Param(getProcedureByIdParamsValidationPipe) params: GetProcedureByIdParamsSchema) {
		const { procedureId } = params;

		const result = await this.getProcedureByIdUseCase.execute({ procedureId });

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ProcedureNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { procedure } = unwrapEither(result);

		return ProcedurePresenter.toHTTP(procedure);
	}
}

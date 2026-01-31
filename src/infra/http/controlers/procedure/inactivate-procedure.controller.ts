import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProcedureNotFoundError } from "@/shared/errors/procedure-not-found-error";
import { InactivateProcedureUseCase } from "@/domain/application/use-cases/procedure/inactivate-procedure";
import { Controller, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProcedurePresenter } from "../../presenters/procedure-presenter";

const inactivateProcedureParamsSchema = z.object({
	procedureId: z.string(),
});

type InactivateProcedureParamsSchema = z.infer<typeof inactivateProcedureParamsSchema>;

const inactivateProcedureParamsValidationPipe = new ZodValidationPipe(inactivateProcedureParamsSchema);

@Controller("/procedures")
export class InactivateProcedureController {
	constructor(private readonly inactivateProcedureUseCase: InactivateProcedureUseCase) {}

	@Patch("/:procedureId/inactivate")
	async handle(@Param(inactivateProcedureParamsValidationPipe) params: InactivateProcedureParamsSchema) {
		const { procedureId } = params;

		const result = await this.inactivateProcedureUseCase.execute({ procedureId });

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

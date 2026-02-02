import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProcedureNotFoundError } from "@/shared/errors/procedure-not-found-error";
import { InactivateProcedureUseCase } from "@/domain/application/use-cases/procedure/inactivate-procedure";
import {
	Controller,
	NotFoundException,
	Param,
	Patch,
} from "@nestjs/common";
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProcedurePresenter } from "../../presenters/procedure-presenter";

const inactivateProcedureParamsSchema = z.object({
	procedureId: z.string(),
});

type InactivateProcedureParamsSchema = z.infer<typeof inactivateProcedureParamsSchema>;

const inactivateProcedureParamsValidationPipe = new ZodValidationPipe(inactivateProcedureParamsSchema);

@ApiTags("Procedures")
@Controller("/procedures")
export class InactivateProcedureController {
	constructor(private readonly inactivateProcedureUseCase: InactivateProcedureUseCase) {}

	@Patch("/:procedureId/inactivate")
	@ApiOperation({
		summary: "Inactivate procedure",
		description: "Inactivates a procedure.",
	})
	@ApiParam({
		name: "procedureId",
		type: String,
		description: "Procedure identifier",
	})
	@ApiOkResponse({
		description: "Procedure inactivated successfully",
	})
	@ApiNotFoundResponse({
		description: "Procedure not found",
	})
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

import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProcedureNotFoundError } from "@/shared/errors/procedure-not-found-error";
import { GetProcedureByIdUseCase } from "@/domain/application/use-cases/procedure/get-procedure-by-id";
import {
	Controller,
	Get,
	NotFoundException,
	Param,
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

const getProcedureByIdParamsSchema = z.object({
	procedureId: z.string(),
});

type GetProcedureByIdParamsSchema = z.infer<typeof getProcedureByIdParamsSchema>;

const getProcedureByIdParamsValidationPipe = new ZodValidationPipe(getProcedureByIdParamsSchema);

@ApiTags("Procedures")
@Controller("/procedures")
export class GetProcedureByIdController {
	constructor(private readonly getProcedureByIdUseCase: GetProcedureByIdUseCase) {}

	@Get("/:procedureId")
	@ApiOperation({
		summary: "Get procedure by ID",
		description: "Retrieves procedure information by its identifier.",
	})
	@ApiParam({
		name: "procedureId",
		type: String,
		description: "Procedure identifier",
	})
	@ApiOkResponse({
		description: "Procedure retrieved successfully",
	})
	@ApiNotFoundResponse({
		description: "Procedure not found",
	})
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

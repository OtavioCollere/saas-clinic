import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProcedureNotFoundError } from "@/shared/errors/procedure-not-found-error";
import { EditProcedureUseCase } from "@/domain/application/use-cases/procedure/edit-procedure";
import {
	BadRequestException,
	Body,
	Controller,
	NotFoundException,
	Param,
	Patch,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProcedurePresenter } from "../../presenters/procedure-presenter";

const editProcedureBodySchema = z.object({
	name: z.string().optional(),
	price: z.number().positive().optional(),
	notes: z.string().optional(),
});

const editProcedureParamsSchema = z.object({
	procedureId: z.string(),
});

type EditProcedureBodySchema = z.infer<typeof editProcedureBodySchema>;
type EditProcedureParamsSchema = z.infer<typeof editProcedureParamsSchema>;

const editProcedureBodyValidationPipe = new ZodValidationPipe(editProcedureBodySchema);
const editProcedureParamsValidationPipe = new ZodValidationPipe(editProcedureParamsSchema);

@ApiTags("Procedures")
@Controller("/procedures")
export class EditProcedureController {
	constructor(private readonly editProcedureUseCase: EditProcedureUseCase) {}

	@Patch("/:procedureId")
	@ApiOperation({
		summary: "Edit procedure",
		description: "Updates procedure information.",
	})
	@ApiParam({
		name: "procedureId",
		type: String,
		description: "Procedure identifier",
	})
	@ApiOkResponse({
		description: "Procedure updated successfully",
	})
	@ApiNotFoundResponse({
		description: "Procedure not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid request data",
	})
	async handle(
		@Param(editProcedureParamsValidationPipe) params: EditProcedureParamsSchema,
		@Body(editProcedureBodyValidationPipe) body: EditProcedureBodySchema
	) {
		const { procedureId } = params;
		const { name, price, notes } = body;

		const result = await this.editProcedureUseCase.execute({
			procedureId,
			name,
			price,
			notes,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ProcedureNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { procedure } = unwrapEither(result);

		return ProcedurePresenter.toHTTP(procedure);
	}
}

import { isLeft, unwrapEither } from "@/core/either/either";
import { ProcedureNotFoundError } from "@/core/errors/procedure-not-found-error";
import { EditProcedureUseCase } from "@/domain/application/use-cases/procedure/edit-procedure";
import { BadRequestException, Body, Controller, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
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

@Controller("/procedures")
export class EditProcedureController {
	constructor(private readonly editProcedureUseCase: EditProcedureUseCase) {}

	@Patch("/:procedureId")
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

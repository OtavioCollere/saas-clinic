import { isLeft, unwrapEither } from "@/core/either/either";
import { FranchiseNotFoundError } from "@/core/errors/franchise-not-found-error";
import { CreateProcedureUseCase } from "@/domain/application/use-cases/procedure/create-procedure";
import { Body, Controller, NotFoundException, Post, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProcedurePresenter } from "../../presenters/procedure-presenter";

const createProcedureBodySchema = z.object({
	franchiseId: z.string(),
	name: z.string(),
	price: z.number().positive(),
	notes: z.string().optional(),
});

type CreateProcedureBodySchema = z.infer<typeof createProcedureBodySchema>;

const createProcedureBodyValidationPipe = new ZodValidationPipe(createProcedureBodySchema);

@Controller("/procedures")
export class CreateProcedureController {
	constructor(private readonly createProcedureUseCase: CreateProcedureUseCase) {}

	@Post()
	async handle(@Body(createProcedureBodyValidationPipe) body: CreateProcedureBodySchema) {
		const { franchiseId, name, price, notes } = body;

		const result = await this.createProcedureUseCase.execute({
			franchiseId,
			name,
			price,
			notes,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case FranchiseNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new NotFoundException(error.message);
			}
		}

		const { procedure } = unwrapEither(result);

		return ProcedurePresenter.toHTTP(procedure);
	}
}

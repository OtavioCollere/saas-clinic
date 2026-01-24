import { isLeft, unwrapEither } from "@/core/either/either";
import { FranchiseNotFoundError } from "@/core/errors/franchise-not-found-error";
import { ProfessionalAlreadyExistsError } from "@/core/errors/professional-already-exists-error";
import { UserIsNotOwnerError } from "@/core/errors/user-is-not-owner-error";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import type { CreateProfessionalUseCase } from "@/domain/application/use-cases/professional/create-professional";
import { BadRequestException, Body, Controller, ForbiddenException, NotFoundException, Param, Post, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ProfessionalPresenter } from "../../presenters/professional-presenter";

const createProfessionalBodySchema = z.object({
	userId: z.string(),
	ownerId: z.string(),
	council: z.string(),
	councilNumber: z.string(),
	councilState: z.string(),
	profession: z.string(),
});

const createProfessionalParamsSchema = z.object({
	franchiseId: z.string(),
});

type CreateProfessionalBodySchema = z.infer<typeof createProfessionalBodySchema>;
type CreateProfessionalParamsSchema = z.infer<typeof createProfessionalParamsSchema>;

const createProfessionalBodyValidationPipe = new ZodValidationPipe(createProfessionalBodySchema);
const createProfessionalParamsValidationPipe = new ZodValidationPipe(createProfessionalParamsSchema);

@Controller("/franchises")
export class CreateProfessionalController {
	constructor(private readonly createProfessionalUseCase: CreateProfessionalUseCase) {}

	@Post("/:franchiseId/professionals")
	async handle(
		@Param(createProfessionalParamsValidationPipe) params: CreateProfessionalParamsSchema,
		@Body(createProfessionalBodyValidationPipe) body: CreateProfessionalBodySchema,
	) {
		const { franchiseId } = params;
		const { userId, ownerId, council, councilNumber, councilState, profession } = body;

		const result = await this.createProfessionalUseCase.execute({
			franchiseId,
			userId,
			ownerId,
			council,
			councilNumber,
			councilState,
			profession,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case UserNotFoundError:
					throw new NotFoundException(error.message);
				case FranchiseNotFoundError:
					throw new NotFoundException(error.message);
				case UserIsNotOwnerError:
					throw new ForbiddenException(error.message);
				case ProfessionalAlreadyExistsError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { professional } = unwrapEither(result);

		return ProfessionalPresenter.toHTTP(professional);
	}
}

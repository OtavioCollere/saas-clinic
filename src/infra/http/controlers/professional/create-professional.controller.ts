import { isLeft, unwrapEither } from "@/shared/either/either";
import { FranchiseNotFoundError } from "@/shared/errors/franchise-not-found-error";
import { ProfessionalAlreadyExistsError } from "@/shared/errors/professional-already-exists-error";
import { UserIsNotOwnerError } from "@/shared/errors/user-is-not-owner-error";
import { UserNotFoundError } from "@/shared/errors/user-not-found-error";
import { CreateProfessionalUseCase } from "@/domain/application/use-cases/professional/create-professional";
import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	NotFoundException,
	Param,
	Post,
} from "@nestjs/common";
import {
	ApiBadRequestResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
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

@ApiTags("Professionals")
@Controller("/franchises")
export class CreateProfessionalController {
	constructor(private readonly createProfessionalUseCase: CreateProfessionalUseCase) {}

	@Post("/:franchiseId/professionals")
	@ApiOperation({
		summary: "Create professional",
		description: "Creates a new professional for a franchise if the authenticated user is the clinic owner.",
	})
	@ApiParam({
		name: "franchiseId",
		type: String,
		description: "Franchise identifier",
	})
	@ApiOkResponse({
		description: "Professional created successfully",
	})
	@ApiForbiddenResponse({
		description: "User is not the clinic owner",
	})
	@ApiNotFoundResponse({
		description: "User or franchise not found",
	})
	@ApiBadRequestResponse({
		description: "Invalid request data or professional already exists",
	})
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

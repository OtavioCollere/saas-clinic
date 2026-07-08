import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProfessionalNotFoundError } from "@/shared/errors/professional-not-found-error";
import { UserIsNotOwnerError } from "@/shared/errors/user-is-not-owner-error";
import { ActivateProfessionalUseCase } from "@/domain/application/use-cases/professional/activate-professional";
import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	NotFoundException,
	Param,
	Patch,
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

const activateProfessionalBodySchema = z.object({
	userId: z.string(),
});

const activateProfessionalParamsSchema = z.object({
	professionalId: z.string(),
});

type ActivateProfessionalBodySchema = z.infer<typeof activateProfessionalBodySchema>;
type ActivateProfessionalParamsSchema = z.infer<typeof activateProfessionalParamsSchema>;

const activateProfessionalBodyValidationPipe = new ZodValidationPipe(activateProfessionalBodySchema);
const activateProfessionalParamsValidationPipe = new ZodValidationPipe(activateProfessionalParamsSchema);

@ApiTags("Professionals")
@Controller("/professionals")
export class ActivateProfessionalController {
	constructor(private readonly activateProfessionalUseCase: ActivateProfessionalUseCase) {}

	@Patch("/:professionalId/activate")
	@ApiOperation({
		summary: "Activate professional",
		description: "Activates a professional if the authenticated user is the clinic owner.",
	})
	@ApiParam({
		name: "professionalId",
		type: String,
		description: "Professional identifier",
	})
	@ApiOkResponse({
		description: "Professional activated successfully",
	})
	@ApiForbiddenResponse({
		description: "User is not the clinic owner",
	})
	@ApiNotFoundResponse({
		description: "Professional not found",
	})
	@ApiBadRequestResponse({
		description: "Bad request",
	})
	async handle(
		@Param(activateProfessionalParamsValidationPipe) params: ActivateProfessionalParamsSchema,
		@Body(activateProfessionalBodyValidationPipe) body: ActivateProfessionalBodySchema,
	) {
		const { professionalId } = params;
		const { userId } = body;

		const result = await this.activateProfessionalUseCase.execute({
			professionalId,
			userId,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case ProfessionalNotFoundError:
					throw new NotFoundException(error.message);
				case UserIsNotOwnerError:
					throw new ForbiddenException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { professional } = unwrapEither(result);

		return ProfessionalPresenter.toHTTP(professional);
	}
}

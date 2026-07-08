import { isLeft, unwrapEither } from "@/shared/either/either";
import { ProfessionalNotFoundError } from "@/shared/errors/professional-not-found-error";
import { ProfessionalHasPendingAppointmentsError } from "@/shared/errors/professional-has-pending-appointments-error";
import { UserIsNotOwnerError } from "@/shared/errors/user-is-not-owner-error";
import { InactivateProfessionalUseCase } from "@/domain/application/use-cases/professional/inactivate-professional";
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

const inactivateProfessionalBodySchema = z.object({
	userId: z.string(),
});

const inactivateProfessionalParamsSchema = z.object({
	professionalId: z.string(),
});

type InactivateProfessionalBodySchema = z.infer<typeof inactivateProfessionalBodySchema>;
type InactivateProfessionalParamsSchema = z.infer<typeof inactivateProfessionalParamsSchema>;

const inactivateProfessionalBodyValidationPipe = new ZodValidationPipe(inactivateProfessionalBodySchema);
const inactivateProfessionalParamsValidationPipe = new ZodValidationPipe(inactivateProfessionalParamsSchema);

@ApiTags("Professionals")
@Controller("/professionals")
export class InactivateProfessionalController {
	constructor(private readonly inactivateProfessionalUseCase: InactivateProfessionalUseCase) {}

	@Patch("/:professionalId/inactivate")
	@ApiOperation({
		summary: "Inactivate professional",
		description: "Inactivates a professional if the authenticated user is the clinic owner and there are no pending appointments.",
	})
	@ApiParam({
		name: "professionalId",
		type: String,
		description: "Professional identifier",
	})
	@ApiOkResponse({
		description: "Professional inactivated successfully",
	})
	@ApiForbiddenResponse({
		description: "User is not the clinic owner",
	})
	@ApiNotFoundResponse({
		description: "Professional not found",
	})
	@ApiBadRequestResponse({
		description: "Professional has pending appointments",
	})
	async handle(
		@Param(inactivateProfessionalParamsValidationPipe) params: InactivateProfessionalParamsSchema,
		@Body(inactivateProfessionalBodyValidationPipe) body: InactivateProfessionalBodySchema,
	) {
		const { professionalId } = params;
		const { userId } = body;

		const result = await this.inactivateProfessionalUseCase.execute({
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
				case ProfessionalHasPendingAppointmentsError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { professional } = unwrapEither(result);

		return ProfessionalPresenter.toHTTP(professional);
	}
}

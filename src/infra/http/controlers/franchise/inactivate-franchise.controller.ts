import { isLeft, unwrapEither } from "@/shared/either/either";
import { FranchiseHasPendingAppointmentsError } from "@/shared/errors/franchise-has-pending-appointments-error";
import { FranchiseNotFoundError } from "@/shared/errors/franchise-not-found-error";
import { UserIsNotOwnerError } from "@/shared/errors/user-is-not-owner-error";
import { InactivateFranchiseUseCase } from "@/domain/application/use-cases/franchise/inactivate-franchise";
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
import { FranchisePresenter } from "../../presenters/franchise-presenter";

const inactivateFranchiseBodySchema = z.object({
	userId: z.string(),
});

const inactivateFranchiseParamsSchema = z.object({
	franchiseId: z.string(),
});

type InactivateFranchiseBodySchema = z.infer<typeof inactivateFranchiseBodySchema>;
type InactivateFranchiseParamsSchema = z.infer<typeof inactivateFranchiseParamsSchema>;

const inactivateFranchiseBodyValidationPipe = new ZodValidationPipe(inactivateFranchiseBodySchema);
const inactivateFranchiseParamsValidationPipe = new ZodValidationPipe(inactivateFranchiseParamsSchema);

@ApiTags("Franchises")
@Controller("/franchises")
export class InactivateFranchiseController {
	constructor(private readonly inactivateFranchiseUseCase: InactivateFranchiseUseCase) {}

	@Patch("/:franchiseId/inactivate")
	@ApiOperation({
		summary: "Inactivate franchise",
		description: "Inactivates a franchise if the authenticated user is the clinic owner and there are no pending appointments.",
	})
	@ApiParam({
		name: "franchiseId",
		type: String,
		description: "Franchise identifier",
	})
	@ApiOkResponse({
		description: "Franchise inactivated successfully",
	})
	@ApiForbiddenResponse({
		description: "User is not the clinic owner",
	})
	@ApiNotFoundResponse({
		description: "Franchise not found",
	})
	@ApiBadRequestResponse({
		description: "Franchise has pending appointments",
	})
	async handle(
		@Param(inactivateFranchiseParamsValidationPipe) params: InactivateFranchiseParamsSchema,
		@Body(inactivateFranchiseBodyValidationPipe) body: InactivateFranchiseBodySchema,
	) {
		const { franchiseId } = params;
		const { userId } = body;

		const result = await this.inactivateFranchiseUseCase.execute({
			franchiseId,
			userId,
		});

		if (isLeft(result)) {
			const error = unwrapEither(result);

			switch (error.constructor) {
				case FranchiseNotFoundError:
					throw new NotFoundException(error.message);
				case UserIsNotOwnerError:
					throw new ForbiddenException(error.message);
				case FranchiseHasPendingAppointmentsError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { franchise } = unwrapEither(result);

		return FranchisePresenter.toHTTP(franchise);
	}
}

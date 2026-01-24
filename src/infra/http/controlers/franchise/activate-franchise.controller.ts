import { isLeft, unwrapEither } from "@/core/either/either";
import { FranchiseHasPendingAppointmentsError } from "@/core/errors/franchise-has-pending-appointments-error";
import { FranchiseNotFoundError } from "@/core/errors/franchise-not-found-error";
import { UserIsNotOwnerError } from "@/core/errors/user-is-not-owner-error";
import type { ActivateFranchiseUseCase } from "@/domain/application/use-cases/franchise/activate-franchise";
import { BadRequestException, Body, Controller, ForbiddenException, NotFoundException, Param, Patch, UsePipes } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { FranchisePresenter } from "../../presenters/franchise-presenter";

const activateFranchiseBodySchema = z.object({
	userId: z.string(),
});

const activateFranchiseParamsSchema = z.object({
	franchiseId: z.string(),
});

type ActivateFranchiseBodySchema = z.infer<typeof activateFranchiseBodySchema>;
type ActivateFranchiseParamsSchema = z.infer<typeof activateFranchiseParamsSchema>;

const activateFranchiseBodyValidationPipe = new ZodValidationPipe(activateFranchiseBodySchema);
const activateFranchiseParamsValidationPipe = new ZodValidationPipe(activateFranchiseParamsSchema);

@Controller("/franchises")
export class ActivateFranchiseController {
	constructor(private readonly activateFranchiseUseCase: ActivateFranchiseUseCase) {}

	@Patch("/:franchiseId/activate")
	async handle(
		@Param(activateFranchiseParamsValidationPipe) params: ActivateFranchiseParamsSchema,
		@Body(activateFranchiseBodyValidationPipe) body: ActivateFranchiseBodySchema,
	) {
		const { franchiseId } = params;
		const { userId } = body;

		const result = await this.activateFranchiseUseCase.execute({
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
